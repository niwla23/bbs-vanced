import { redirect } from '@sveltejs/kit';
import { checkSettings } from '@/lib/settings';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async (input) => {
  await checkSettings(input.cookies)

}
