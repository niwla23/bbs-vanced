export interface TimetableLesson {
  teacher: string | null
  subject: string | null
  room: string | null
}

export interface TimetableDay {
  [hour: number]: TimetableLesson
}