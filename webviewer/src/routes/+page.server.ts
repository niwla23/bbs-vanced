import { redirect } from '@sveltejs/kit';
import { checkSettings } from '@/lib/settings';
import type { PageServerLoad } from './$types';

// black magic, stole it from stackoverflow
function getNextMonday() {
  const d = new Date();
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
  return d
}

function getLogicalDate() {
  const now = new Date()
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 5
  const isSchoolOver = now.getHours() > 16

  if (!isWeekday) {
    return getNextMonday()
  }

  if (isSchoolOver) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }

  return now
}

export const load: PageServerLoad = (input) => {
  checkSettings(input.cookies)
}
