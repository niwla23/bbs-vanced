
import type { RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/public'

export const GET: RequestHandler = async (event) => {
  event.setHeaders({ "cache-control": "max-age=600" })
  return new Response(env.PUBLIC_VAPID_KEY);
}
