import type { RequestHandler } from "@sveltejs/kit";
import type { TimetableDay, TimetableWeek } from 'bbs-parser/src/types';
import { getSessionToken, getTimetable } from "bbs-parser"
import { autoMergeTimeslots } from "bbs-parser/src/helpers"
import { areSettingsComplete, getSettings } from '@/lib/settings';

function sendJson(data: any) {
  return new Response(JSON.stringify(data))
}

export const GET: RequestHandler = async (event) => {
  const settings = getSettings(event.cookies)
  if (!settings) {
    return sendJson({ "error": "settings cookie not found" })
  }

  if (!areSettingsComplete(settings)) {
    return sendJson({ "error": "settings are incomplete" })
  }

  // if it works it aint broken
  const date = new Date(event.url.searchParams.get("date") || new Date())

  const token = await getSessionToken(settings?.username, settings?.password)
  const timetable = await getTimetable(token, settings?.className, date, true) as TimetableWeek
  const timetableMerged = new Map<Date, TimetableDay>()

  for (const [day, entries] of timetable.entries()) {
    const merged = autoMergeTimeslots(entries)
    timetableMerged.set(day, merged)
  }

  event.setHeaders({ "cache-control": "max-age=0" })


  return new Response(JSON.stringify({
    timetableMerged: Array.from(timetableMerged.entries()),
    settings,
    timestamp: new Date().toJSON()
  }), { headers: { "content-type": "application/json" } });
}
