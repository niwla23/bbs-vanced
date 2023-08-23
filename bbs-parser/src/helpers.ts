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
