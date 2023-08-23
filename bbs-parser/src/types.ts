export interface TimetableLesson {
  hour: number | null
  teacher: string | null
  subject: string | null
  room: string | null
}

export type TimetableTimeSlot = TimetableLesson[]
export type TimetableDay = [number[], TimetableTimeSlot][]
export type TimetableWeek = Map<Date, TimetableTimeSlot[]>
