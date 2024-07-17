
import type { RequestHandler } from "@sveltejs/kit";
import { getMergedTimetableServer, logEvent, pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import ical, { ICalCalendarMethod } from 'ical-generator';
import { filterWeekTimetable, getNextMonday, getTimesForSlot } from "@/lib/timetableHelpers";
import type { TimetableDay, TimetableLesson, TimetableTimeSlot } from "bbs-parser/src/types";
import { getClassesList, getSessionToken } from "bbs-parser";


function getCleanRoomsFromString(x: string): string[] {
  // Trim the input to remove any leading/trailing whitespace
  const trimmed = x.trim();

  // Handle prefix stripping (e.g., A:B048 to B048)
  const colonIndex = trimmed.indexOf(':');
  if (colonIndex !== -1) {
    return [trimmed.slice(colonIndex + 1)];
  }

  // Check for a range pattern (e.g., B068-069)
  if (trimmed.includes('-')) {
    const [start, end] = trimmed.split('-');
    if (end.length <= 2) return [trimmed];
    const prefix = start.replace(/\d+/g, ''); // Get the prefix (letters only)
    const startNum = parseInt(start.replace(prefix, ''));
    const endNum = parseInt(end.replace(prefix, ''));

    const result: string[] = [];
    for (let i = startNum; i <= endNum; i++) {
      result.push(`${prefix}${i.toString().padStart(3, '0')}`);
    }
    return result;
  }

  // Return the trimmed input as-is if no prefix or range
  return [trimmed];
}

export const GET: RequestHandler = async (event) => {
  // if it works it aint broken
  const date = new Date(event.url.searchParams.get("date") || new Date())
  date.setHours(12, 0, 0, 0)

  await pbAuth()

  const sessionToken = await getSessionToken("bbs-walsrode", "schueler")

  const classesList = await getClassesList(sessionToken);
  console.log(classesList.length)
  console.log(classesList)

  type RoomMapping = {
    [room: string]: { lesson: TimetableLesson, className: string }[][];
  }
  const rooms: RoomMapping = {};

  for (const className of classesList) {
    const { timetableRaw, cacheHit } = await getMergedTimetableServer(className, date, true, sessionToken, 7200)
    console.log(timetableRaw.keys())
    console.log(`downloaded timetable for ${className}, cache hit: ${cacheHit}`)
    // const timetableTodayKey = date;

    const timetableTodayKey = Array.from(timetableRaw.keys()).find(d => d.getMonth() == date.getMonth() && d.getDate() == date.getDate() && d.getFullYear() == date.getFullYear())
    if (!timetableTodayKey) continue
    const timetableToday = timetableRaw.get(timetableTodayKey);
    if (!timetableToday) continue

    for (const [hour, slot] of timetableToday.entries()) {
      for (const lesson of slot) {
        if (!lesson.room) continue
        for (const room of getCleanRoomsFromString(lesson.room)) {
          if (!rooms[room]) rooms[room] = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
          rooms[room][hour].push({ lesson, className })
        }
      }
    }
  }

  for (const r of Object.keys(rooms)) {
    console.log(r)
  }

  return new Response(JSON.stringify({ rooms }), { headers: { "content-type": "application/json" } })
}
