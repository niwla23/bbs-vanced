// place files you want to import through the `$lib` alias in this folder.
import { env } from '$env/dynamic/private';
import PocketBase, { type RecordModel } from 'pocketbase';
export const pb = new PocketBase('https://bbs-backend.noteqr.de');
pb.autoCancellation(false)
import { autoMergeTimeslots } from "bbs-parser/src/helpers";
import { createRedis, deserialize, serialize } from "./cache";
import { getSessionToken, getTimetable } from "bbs-parser";
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

export async function getMergedTimetableServer(className: string, date: Date, useCache: boolean) {
  const redis = await createRedis()
  const cacheKey = `timetable-${className}-${date.toJSON()}-fullweek:true`
  const cacheResult = await redis.get(cacheKey)

  let timetable: TimetableWeek
  let cacheHit = false
  if (useCache && cacheResult && cacheResult != null && cacheResult.length > 5) {
    timetable = deserialize(cacheResult)
    cacheHit = true
  } else {
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

  return { timetableMerged, cacheHit }
}

