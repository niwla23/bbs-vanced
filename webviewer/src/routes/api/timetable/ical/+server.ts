
import type { RequestHandler } from "@sveltejs/kit";
import { getMergedTimetableServer, logEvent, pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import ical, { ICalCalendarMethod } from 'ical-generator';
import { filterWeekTimetable, getNextMonday, getTimesForSlot } from "@/lib/timetableHelpers";
import type { TimetableDay } from "bbs-parser/src/types";


export const GET: RequestHandler = async (event) => {
  // if it works it aint broken
  const date = new Date(event.url.searchParams.get("date") || new Date())
  const userId = event.url.searchParams.get("userId")
  if (userId == null) return sendJson({ "error": "no userId given" }, 400)

  await pbAuth()
  const user = await pb.collection("users").getOne(userId)
  if (!user) return sendJson({ "error": "no user with that id found in db" }, 404)

  const { timetableMerged: timetableMergedThis, cacheHit: cacheHit1 } = await getMergedTimetableServer(user.settings.className, date, true)
  const { timetableMerged: timetableMergedNext, cacheHit: cacheHit2 } = await getMergedTimetableServer(user.settings.className, getNextMonday(date), true)
  const timetableMerged = [...timetableMergedThis, ...timetableMergedNext]

  const filteredTimetable = filterWeekTimetable(user.settings, timetableMerged) as [Date, TimetableDay][]


  const calendar = ical({ name: "BBS Stundenplan (Vanced)" })
  calendar.method(ICalCalendarMethod.REQUEST)

  for (const [date, currentData] of filteredTimetable) {
    for (const [hours, slot] of currentData) {
      for (const lesson of slot) {
        const { start, end } = getTimesForSlot(date, hours)

        calendar.createEvent({
          start,
          end,
          summary: `${lesson.subject} @ ${lesson.teacher}`,
          description: "",
          location: lesson.room,
        })
      }
    }
  }



  logEvent("timetable_ical", { className: user.settings.className, date, cacheAllow: true, cacheHit: cacheHit1 && cacheHit2, url: event.url.toString(), hasPro: user.proKey != "", user: user.id })

  event.setHeaders({ "cache-control": "max-age=0" })
  return new Response(calendar.toString())
}
