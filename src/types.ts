export interface TimetableLesson {
  teacher: string
  subject: string
  room: string
}

export interface TimetableDay {
  [hour: number]: TimetableLesson
}