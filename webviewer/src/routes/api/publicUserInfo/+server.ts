
import type { RequestHandler } from "@sveltejs/kit";
import { getExamsServer } from "@/lib/exams";
import { env } from '$env/dynamic/private'
import { logEvent, pb, pbAuth, sendJson } from "@/lib/serverHelpers";


export const GET: RequestHandler = async (event) => {
  const userEmail = event.url.searchParams.get("userEmail")
  if (userEmail == null) return sendJson({ "error": "no userEmail given" }, 400)

  await pbAuth()

  const filterTemplate = "email = {:userEmail}"
  try {

    const user = await pb.collection('users').getFirstListItem(pb.filter(filterTemplate, { userEmail }), { requestKey: null })

    event.setHeaders({ "cache-control": "max-age=0" })
    return sendJson({ courses: user.settings.courses, className: user.settings.className })
  } catch {
    return sendJson({ error: "no such user" }, 400)
  }
}
