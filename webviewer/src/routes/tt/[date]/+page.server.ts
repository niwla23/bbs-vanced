import type { TimetableTimeSlot } from 'bbs-parser/src/types';
import type { PageServerLoad } from './$types';
import { getSessionToken, getTimetable } from "bbs-parser"
import { areSettingsComplete, getSettings } from '@/lib/settings';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (input) => {
  const settings = getSettings(input.cookies)
  if (!settings) {
    throw redirect(307, `/settings`);
  }

  if (!areSettingsComplete(settings)) {
    throw redirect(307, `/settings`);
  }

  const token = await getSessionToken(settings?.username, settings?.password)
  const timetable = await getTimetable(token, settings?.className, new Date(input.params.date)) as TimetableTimeSlot[]

  return {
    timetable,
    settings
  };
};
