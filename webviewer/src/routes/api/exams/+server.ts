
import type { RequestHandler } from "@sveltejs/kit";
import { areSettingsComplete, getSettings } from '@/lib/settings';
import { getExamsServer } from "@/lib/exams";
import { env } from '$env/dynamic/private'
import { logEvent } from "@/lib/serverHelpers";

function sendJson(data: any) {
  return new Response(JSON.stringify(data))
}

export const GET: RequestHandler = async (event) => {
  const settings = getSettings(event.cookies)
  if (!settings) {
    return sendJson({ "error": "settings cookie not found" })
  }

  if (!areSettingsComplete(settings)) {
    // if it works it aint broken
    return sendJson({ "error": "settings are incomplete" })
  }

  const date = new Date(event.url.searchParams.get("date") || new Date())

  const exams = await getExamsServer(env.PB_USER as string, env.PB_PASSWORD as string, settings.className, "bbs-walsrode")

  logEvent("exams", { className: settings.className, date, url: event.url.toString() })
  event.setHeaders({ "cache-control": "max-age=0" })
  return new Response(JSON.stringify(exams), { headers: { "content-type": "application/json" } });
}
