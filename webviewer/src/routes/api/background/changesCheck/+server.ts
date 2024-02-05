import { pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import { filterWeekTimetable, getNextMonday, getTimetableWithDatesClient } from "@/lib/timetableHelpers";
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

async function handleChange(user: RecordModel, date: Date, newDataSerialized: string, oldDataSerialized: string) {
  const oldData = deserialize(oldDataSerialized)
  const newData = deserialize(newDataSerialized)
  const formattedDate = formatDateToGermanLongDate(date)

  const resend = new Resend(env.RESEND_API_KEY)
  const html = render({
    template: TimetableChangeEmail,
    props: {
      formattedDate,
      oldData,
      newData,
    }
  });

  if (user.notificationEmail) {
    const res = await resend.emails.send({
      from: 'noreply@notifications.noteqr.de',
      to: user.notificationEmail,
      subject: `Stundenplanänderung ${formattedDate}`,
      html
    });
    console.log(res)
  }

  const textOptions = ["Tippe hier zum Ansehen", "Es gibt Hoffnung", "Ausfall? Bitteee 🥺🥺", "hier raufklickern bitte"]
  const randomElement = textOptions[Math.floor(Math.random() * textOptions.length)];

  sendNotification(user.id, { title: `Stundenplanänderung ${formattedDate}`, body: randomElement })
}

export const POST: RequestHandler = async (event) => {
  pbAuth()
  const redis = await createRedis()

  const users = await pb.collection("users").getFullList({ filter: "proKey != '' && settings != null" })
  for (const user of users) {
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
        continue
      }

      if (serializedCurrentData != serializedOldData) {
        console.log(`[changeDetect] change detected for user ${user.notificationEmail} on day ${date}: `, serializedCurrentData)
        handleChange(user, date, serializedCurrentData, serializedOldData)
        await redis.set(key, serializedCurrentData)
        await redis.expire(key, 604800) // 7 Tage
      }
    }
  }
  return sendJson({ success: true, "error": null }, 200)
}
