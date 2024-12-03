import type { RequestHandler } from "@sveltejs/kit";
import { getCachedClassList, getMergedTimetableServer, logEvent, sendJson } from "@/lib/serverHelpers";

export const GET: RequestHandler = async (event) => {
  // if it works it aint broken
  const date = new Date(event.url.searchParams.get("date") || new Date())
  const className = event.url.searchParams.get("className")
  const useCache = !event.url.searchParams.has("nocache")
  if (className == null) return sendJson({ "error": "no className given" }, 400)

  // insert code here
  const { timetableMerged, cacheHit } = await getMergedTimetableServer(className, date, useCache, null, 300)
  const classList = await getCachedClassList();

  logEvent("timetable", { className: className, date, cacheAllow: useCache, cacheHit: cacheHit, url: event.url.toString() })
  event.setHeaders({ "cache-control": "max-age=0" })


  return sendJson({
    timetableMerged: Array.from(timetableMerged.entries()),
    timestamp: new Date().toJSON(),
    classList
  })

}
