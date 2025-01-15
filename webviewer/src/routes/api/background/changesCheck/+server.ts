import { pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import { filterWeekTimetable, formatDateForApi, getNextMonday, getTimetableWithDatesClient } from "@/lib/timetableHelpers";
import { createRedis, serialize, deserialize } from "@/lib/cache";
import type { RequestHandler } from "@sveltejs/kit";
import type { TimetableDay } from "bbs-parser/src/types";
import type { RecordModel } from "pocketbase";
import { Resend } from 'resend';
import { env } from "$env/dynamic/private";
import TimetableChangeEmail from '$lib/emails/timetableChange.svelte';
import { render } from 'svelte-email';
import { sendNotification } from "@/lib/notificationsServer";

function formatDateToGermanLongDate(date: Date): string {
  const daysOfWeek = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const monthsOfYear = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek}, ${dayOfMonth}. ${month} ${year}`;
}

export interface ProcessedChange {
  date: Date;
  formattedDate: string;
  oldData: TimetableDay;
  newData: TimetableDay;
}

function processChange(date: Date, newDataSerialized: string, oldDataSerialized: string): ProcessedChange | null {
  const oldData = deserialize(oldDataSerialized)
  const newData = deserialize(newDataSerialized)
  const formattedDate = formatDateToGermanLongDate(date)

  // ignore if date is in the past
  const normalizedDate = new Date(date.getTime())
  const normalizedNow = new Date()
  normalizedDate.setHours(0, 0, 0, 0)
  normalizedNow.setHours(0, 0, 0, 0)
  if (normalizedDate.getTime() < normalizedNow.getTime()) {
    console.log("[changeDetect] detected change is in the past, doing nothing")
    return null
  }

  return { date, formattedDate, oldData, newData }
}

function generateChangesSummary(changes: ProcessedChange[]) {
  const changesSummary = changes.map(change => change.formattedDate.split(",")[0]).join(", ") // we dont talk about this
  if (changesSummary.length > 70) return changesSummary.slice(0, 67) + "...";
  return changesSummary
}

async function handleChanges(user: RecordModel, changes: ProcessedChange[]) {
  if (changes.length >= 3) {
    console.log("discarding push message, more than 3 days changed")
  }

  const changesSummary = generateChangesSummary(changes);
  const resend = new Resend(env.RESEND_API_KEY)
  const html = render({ template: TimetableChangeEmail, props: { changes, changesSummary } });

  if (user.notificationEmail) {
    await resend.emails.send({
      from: 'noreply@notifications.noteqr.de',
      to: user.notificationEmail,
      subject: `Stundenplanänderung ${changesSummary}`,
      html
    });
  }

  sendNotification(user.id, { title: `Stundenplanänderung`, body: changesSummary, data: { targetUrl: `/#${formatDateForApi(changes[0].date)}` } })
}

export const POST: RequestHandler = async (event) => {
  console.log("[changeDetect] received request to check for timetable updates")
  await pbAuth()
  const redis = await createRedis()
  console.log("[changeDetect] got access to redis and the backend")

  const users = await pb.collection("users").getFullList({ filter: "proKey != '' && settings != null" })
  for (const user of users) {
    const changesFoundForUser = []

    const timetableWithDates = [
      ...await getTimetableWithDatesClient(new Date(), true, user.settings, event.fetch),
      ...await getTimetableWithDatesClient(getNextMonday(new Date()), true, user.settings, event.fetch)
    ]
    const filteredTimetable = filterWeekTimetable(user.settings, timetableWithDates) as [Date, TimetableDay][]
    for (const [date, currentData] of filteredTimetable) {
      const key = `saved_timetables:${user.id}:${date.toJSON().split("T")[0]}`

      const serializedCurrentData = serialize(currentData)
      const serializedOldData = await redis.get(key)

      if (serializedOldData == null) {
        await redis.set(key, serializedCurrentData)
        await redis.expire(key, 604800) // 7 Tage
        continue
      }

      if (serializedCurrentData != serializedOldData) {
        console.log(`[changeDetect] change detected for user ${user.notificationEmail} on day ${date}: `, serializedCurrentData)
        // handleChange(user, date, serializedCurrentData, serializedOldData)
        const processedChange = processChange(date, serializedCurrentData, serializedOldData)
        if (processedChange != null) changesFoundForUser.push(processedChange)
        await redis.set(key, serializedCurrentData)
        await redis.expire(key, 604800) // 7 Tage
      }
    }

    // if changes were detected, notify user
    if (changesFoundForUser.length > 0) await handleChanges(user, changesFoundForUser)
  }
  return sendJson({ success: true, "error": null }, 200)
}
