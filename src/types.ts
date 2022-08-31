export interface TimetableLesson {
  hour: number | null
  teacher: string | null
  subject: string | null
  room: string | null
}

export type TimetableWeek = Map<Date, TimetableLesson[]>
