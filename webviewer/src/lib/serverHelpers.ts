// place files you want to import through the `$lib` alias in this folder.
import { env } from '$env/dynamic/private';
import PocketBase, { type RecordModel } from 'pocketbase';
export const pb = new PocketBase('https://bbs-backend.noteqr.de');
pb.autoCancellation(false)
import { autoMergeTimeslots } from "bbs-parser/src/helpers";
import { createRedis, deserialize, serialize } from "./cache";
import { getDatestamp, getSessionToken, getTimetable } from "bbs-parser";
import type { TimetableDay, TimetableWeek } from 'bbs-parser/src/types';


interface LogData {
  date?: Date
  url: string
  className?: string
  hasPro?: boolean
  cacheAllow?: boolean
  cacheHit?: boolean,
  user: string
}

export async function pbAuth() {
  await pb.collection('users').authWithPassword(env.PB_USER, env.PB_PASSWORD)
}

export async function logEvent(ressource: string, data: LogData) {
  await pbAuth()
  await pb.collection("logs").create({
    ressource,
    environment: env.NODE_ENV,
    ...data
  })
}


export function sendJson(data: any, status?: number) {
  return new Response(JSON.stringify(data), { status: status || 200 })
}

export async function getMergedTimetableServer(className: string, date: Date, useCache: boolean, sessionToken: string | null = null, maxCacheAge = 300) {
  const redis = await createRedis()
  const cacheKey = `timetable-${className}-${getDatestamp(date)}-fullweek:true`
  const cacheResult = await redis.get(cacheKey)
  const cacheTimestamp = await redis.get(cacheKey + ":timestamp")
  const cacheAge = new Date().getTime() - parseInt(cacheTimestamp ?? "0")

  let timetable: TimetableWeek
  let cacheHit = false
  if (useCache && cacheResult && cacheResult != null && cacheResult.length > 5 && (cacheAge / 1000) < maxCacheAge) {
    timetable = deserialize(cacheResult)
    cacheHit = true
  } else {
    if (!sessionToken) {
      sessionToken = await getSessionToken("bbs-walsrode", "schueler")
    }
    timetable = await getTimetable(sessionToken, className, date, true) as TimetableWeek
    await redis.set(cacheKey, serialize(timetable))
    await redis.set(cacheKey + ":timestamp", new Date().getTime())
    await redis.expire(cacheKey, 21600) // 6h 
  }

  const timetableMerged = new Map<Date, TimetableDay>()

  for (const [day, entries] of timetable.entries()) {
    const merged = autoMergeTimeslots(entries)
    timetableMerged.set(day, merged)

  }

  return { timetableMerged, timetableRaw: timetable, cacheHit }
}

