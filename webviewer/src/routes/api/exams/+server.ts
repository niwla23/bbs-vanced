
import type { RequestHandler } from "@sveltejs/kit";
import { areSettingsComplete, getSettings } from '@/lib/settings';
import { getExamsServer } from "@/lib/exams";
import { env } from '$env/dynamic/private'
import { logEvent, sendJson } from "@/lib/serverHelpers";


export const GET: RequestHandler = async (event) => {
  const className = event.url.searchParams.get("className")
  if (className == null) return sendJson({ "error": "no className given" }, 400)

  const date = new Date(event.url.searchParams.get("date") || new Date())

  const exams = await getExamsServer(env.PB_USER as string, env.PB_PASSWORD as string, className, "bbs-walsrode")

  logEvent("exams", { className: className, date, url: event.url.toString() })
  event.setHeaders({ "cache-control": "max-age=0" })
  return new Response(JSON.stringify(exams), { headers: { "content-type": "application/json" } });
}
