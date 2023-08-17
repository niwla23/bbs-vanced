import { redirect } from '@sveltejs/kit';

export function load() {
  let x = new Date()

  throw redirect(307, `/tt/${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`);
}
