
import type { RequestHandler } from "@sveltejs/kit";
import { getMergedTimetableServer, logEvent, pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import ical, { ICalCalendarMethod } from 'ical-generator';
import { env } from "$env/dynamic/private";
import { getExamsServer } from "@/lib/exams";
import { getTimesForSlot } from "@/lib/timetableHelpers";

export const GET: RequestHandler = async (event) => {
  // if it works it aint broken
  const userId = event.url.searchParams.get("userId")
  if (userId == null) return sendJson({ "error": "no userId given" }, 400)

  await pbAuth()
  const user = await pb.collection("users").getOne(userId)
  if (!user) return sendJson({ "error": "no user with that id found in db" }, 404)

  const examsRaw = await getExamsServer(env.PB_USER as string, env.PB_PASSWORD as string, user.settings.className, "bbs-walsrode")
  const exams = examsRaw.filter((v) => user.settings?.courses.includes(v.subject) || v.subject == '-all-');


  const calendar = ical({ name: "BBS Klausuren (Vanced)" })
  calendar.method(ICalCalendarMethod.REQUEST)

  for (const exam of exams) {
    const { start, end } = getTimesForSlot(new Date(exam.date), [exam.startHour, exam.endHour])
    const reminderDate = new Date(start.getTime())
    reminderDate.setDate(start.getDate() - 2)
    reminderDate.setHours(16, 0)

    const emojis = exam.type == "klausur" ? "❗✏️" : "ℹ️"

    calendar.createEvent({
      start,
      end,
      summary: `${emojis} ${exam.subject != '-all-' ? exam.subject : 'Alle Kurse'}: ${exam.topic}`,
      alarms: [
        {
          trigger: reminderDate
        }
      ]
    })
  }

  logEvent("exams_ical", { className: user.settings.className, cacheAllow: false, url: event.url.toString(), user: user.id, hasPro: user.proKey != "" })

  event.setHeaders({ "cache-control": "max-age=0" })
  return new Response(calendar.toString())
}
