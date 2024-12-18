import type { TimetableTimeSlot } from 'bbs-parser/src/types';
import PocketBase, { type RecordModel, type RecordSubscription } from 'pocketbase';
import { gradeUserDataTemplate, type SubjectUserData } from './grades';
export const pb = new PocketBase('https://bbs-backend.noteqr.de');

export interface Exam {
  date: string
  created: string
  subject: string
  topic: string
  startHour: number
  endHour: number
  upvotes: number
  downvotes: number
  type: "termin" | "klausur"
}


export function formatDate(n: Date) {
  return n.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

export async function getExamsServer(pbUser: string, pbPassword: string, course: string, schoolUsername: string) {
  pb.autoCancellation(false)
  pb.admins.authWithPassword(pbUser, pbPassword)

  const filterTemplate = "course = {:course} && schoolUsername = {:schoolUsername}"

  return await pb.collection('exams').getFullList({
    sort: '+date',
    filter: pb.filter(filterTemplate, { course, schoolUsername }),
    requestKey: null
  });
}

export async function getExamsClient(className: string): Promise<Exam[]> {
  const resp = await fetch(`/api/exams?className=${className}`);
  const text = await resp.text();
  const parsedData = JSON.parse(text);

  return parsedData
}

export function isExamInTimeslot(slot: TimetableTimeSlot, date: Date, hours: number[], exam: Exam) {
  // if the dates do not match, return false
  if (date.toDateString() != new Date(exam.date).toDateString()) return false
  // if no lesson in the slot matches the subject of the exam, return false
  if (!slot.find(e => e.subject == exam.subject) && exam.subject != "-all-") return false
  // if not all hours are between startHour and endHour of the exam return false
  if (!hours.every(e => e >= exam.startHour && e <= exam.endHour)) return false
  return true
}

