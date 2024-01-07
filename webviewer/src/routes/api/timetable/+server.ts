import type { RequestHandler } from "@sveltejs/kit";
import type { TimetableDay, TimetableWeek } from 'bbs-parser/src/types';
import { getSessionToken, getTimetable } from "bbs-parser"
import { autoMergeTimeslots } from "bbs-parser/src/helpers"
import { areSettingsComplete, getSettings } from '@/lib/settings';
import { createRedis, serialize, deserialize } from "@/lib/cache";
import { logEvent, sendJson } from "@/lib/serverHelpers";


// function sendJson(data: any) {
//   return new Response(JSON.stringify(data))
// }

export const GET: RequestHandler = async (event) => {

  // if it works it aint broken
  const date = new Date(event.url.searchParams.get("date") || new Date())
  const className = event.url.searchParams.get("className")
  const useCache = !event.url.searchParams.has("nocache")
  if (className == null) return sendJson({ "error": "no className given" }, 400)

  const redis = await createRedis()
  const cacheKey = `timetable-${className}-${date.toJSON()}-fullweek:true`
  const cacheResult = await redis.get(cacheKey)

  let timetable: TimetableWeek
  let cacheHit = false
  if (useCache && cacheResult && cacheResult != null && cacheResult.length > 5) {
    console.log("cache hit")
    timetable = deserialize(cacheResult)
    cacheHit = true
  } else {
    console.log("cache miss")
    const token = await getSessionToken("bbs-walsrode", "schueler")
    timetable = await getTimetable(token, className, date, true) as TimetableWeek
    await redis.set(cacheKey, serialize(timetable))
    await redis.expire(cacheKey, 300)
  }

  const timetableMerged = new Map<Date, TimetableDay>()

  for (const [day, entries] of timetable.entries()) {
    const merged = autoMergeTimeslots(entries)
    timetableMerged.set(day, merged)
  }


  console.log("useCache", useCache)
  logEvent("timetable", { className: className, date, cacheAllow: useCache, cacheHit: cacheHit, url: event.url.toString() })
  event.setHeaders({ "cache-control": "max-age=0" })


  return new Response(JSON.stringify({
    timetableMerged: Array.from(timetableMerged.entries()),
    timestamp: new Date().toJSON()
  }), { headers: { "content-type": "application/json" } });
}
