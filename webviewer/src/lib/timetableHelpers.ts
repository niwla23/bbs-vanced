import type { TimetableDay } from "bbs-parser/src/types";
import type { Settings } from "./settings";
import { hourTimes } from "./textRessources";

export const weekdayMap = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag'
];

export function formatDateForApi(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getNextMonday(from: Date) {
  const d = new Date(from.getTime())
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
  return d
}

export function getPreviousMonday(from: Date) {
  const d = new Date(from.getTime())
  const dayOfWeek = d.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Calculate the number of days to subtract to get to the previous Monday
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastWeekMonday = new Date(d);
  lastWeekMonday.setDate(d.getDate() - daysToSubtract - 7); // Subtracting 7 days to get to the last week

  return lastWeekMonday;
}

export function getDateByDeltaDays(baseDate: Date, delta: number) {
  const newDate = new Date(baseDate.getTime());
  newDate.setDate(baseDate.getDate() + delta);
  return formatDateForApi(newDate);
}


export function filterTimetable(settings: Settings, timetable: TimetableDay): TimetableDay {
  const showAllCourses = !settings?.courses || settings.courses.length == 0;
  const filtered: TimetableDay = [];
  for (let [hours, slot] of timetable) {
    if (!slot) {
      slot = []
    }
    const filteredSlot = slot.filter(
      (lesson) => lesson.originalSubject && (settings?.courses.includes(lesson.originalSubject) || showAllCourses)
    );
    filtered.push([hours, filteredSlot]);
  }
  const lastIndex = getLastIndex(filtered);
  return filtered.splice(1).splice(0, lastIndex); // we don't want hour 0
}


export function filterWeekTimetable(settings: Settings, timetable: [Date, TimetableDay][]) {
  const all = timetable.map(([day, v]) => {
    const filtered = filterTimetable(settings, v);
    return [day, filtered];
  });

  return all;
}


export function getLastIndex(timetable: TimetableDay) {
  let lastIndex = timetable.length;
  while (lastIndex--) {
    const [hours, currentTimeslot] = timetable[lastIndex];
    if (currentTimeslot && currentTimeslot.length != 0) {
      return lastIndex;
    }
  }
}

export function convertTimeToDate(timeString: string, baseDate: Date) {
  const [hours, minutes] = timeString.split(':');
  const dateWithTime = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), parseInt(hours), parseInt(minutes));
  return dateWithTime;
}

export function isTimeslotActive(startDate: Date, endDate: Date) {
  const now = new Date().getTime()
  return startDate.getTime() < now && now < endDate.getTime()
}


function getActiveLesson() {
  const currentTime = new Date();
  for (let i = 1; i < hourTimes.start.length; i++) {
    const startTime = convertTimeToDate(hourTimes.start[i], new Date());
    const endTime = convertTimeToDate(hourTimes.end[i], new Date());

    if (currentTime >= startTime && currentTime <= endTime) {
      return i; // Lesson is active
    }
  }
  return null; // No lesson is active
}


function getNextLesson() {
  const currentTime = new Date();

  for (let i = 1; i < hourTimes.start.length; i++) {
    const startTime = convertTimeToDate(hourTimes.start[i], new Date());

    if (currentTime < startTime) {
      // The next lesson has not started yet, return its details
      return i
    }
  }

  return null; // No upcoming lessons
}


export function isTimeslotUpNext(startDate: Date, endDate: Date, hours: number[]) {
  const now = new Date().getTime()
  if (startDate.getDate() != new Date().getDate()) return false
  if (now > startDate.getTime()) return false
  if (getActiveLesson()) return false
  return hours.includes(getNextLesson())
}

// https://www.builder.io/blog/relative-time
export function getRelativeTime(date: Date) {
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [60, 70000, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto", style: "short" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export async function getTimetableWithDatesClient(date: Date, useCache: boolean, settings: Settings, fetchFunction = fetch) {
  const resp = await fetchFunction(
    `/api/timetable?date=${formatDateForApi(date)}${useCache ? '' : '&nocache'}&className=${settings.className
    }`
  );
  const text = await resp.text();
  const parsedData = JSON.parse(text);
  const timetableWithDates: [Date, TimetableDay][] = parsedData.timetableMerged.map(
    ([day, data]) => [new Date(day), data]
  );
  return timetableWithDates
}
