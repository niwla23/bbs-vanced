
import { pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import type { RequestHandler } from "@sveltejs/kit";
import { sendNotification } from "@/lib/notificationsServer";

export const POST: RequestHandler = async (event) => {
  const body = await event.request.json();
  console.log(body)

  const subscriptions_count = await sendNotification(body["userId"], body["payload"])

  return sendJson({ success: true, "error": null, subscriptions_count }, 200)
}
