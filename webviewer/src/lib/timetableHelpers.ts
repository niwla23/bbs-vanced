import type { TimetableDay } from "bbs-parser/src/types";
import type { Settings } from "./settings";

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


export function getLastIndex(timetable: TimetableDay) {
  let lastIndex = timetable.length;
  while (lastIndex--) {
    const [hours, currentTimeslot] = timetable[lastIndex];
    if (currentTimeslot && currentTimeslot.length != 0) {
      return lastIndex;
    }
  }
}

