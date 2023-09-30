import { TimetableTimeSlot, TimetableDay } from './types'

function areSlotsEqual(a: TimetableTimeSlot, b: TimetableTimeSlot) {
  const immuA = structuredClone(a)
  const immuB = structuredClone(b)
  immuA.forEach(a => a.hour = -1)
  immuB.forEach(b => b.hour = -1)
  return JSON.stringify(immuA) === JSON.stringify(immuB)
}

export function autoMergeTimeslots(slots: TimetableTimeSlot[]): TimetableDay {
  const dayMap = new Map<number[], TimetableTimeSlot>()
  let skipNext = false
  for (const [i, slot] of slots.entries()) {
    if (i % 2 != 0 && areSlotsEqual(slot, slots[i + 1])) {
      // we only wanna do it for hours 1, 3, 5, 7, 9, ...
      dayMap.set([i, i + 1], slot)
      skipNext = true
    } else {
      if (!skipNext) {
        dayMap.set([i], slot)
      } else {
        skipNext = false
      }
    }
  }
  return Array.from(dayMap.entries())
}

export function dateTimeReviver(key, value) {
  var a;
  if (typeof value === 'string') {
    a = /\/Date\((\d*)\)\//.exec(value);
    if (a) {
      return new Date(+a[1]);
    }
  }
  return value;
}


export function extractOriginalSubject(input: string) {
  if (!input) return null
  const regex = /<([^>]+)>(.*?)<\/\1>/g;
  const match = regex.exec(input);
  const isolatedSubject = match ? match[2] || input : input;
  return isolatedSubject.trim()
}
