import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import webpush from "web-push"
import { pb, pbAuth } from "./serverHelpers";

interface Payload extends NotificationOptions {
  title: string
}

export async function sendNotification(userId: string, data: Payload) {
  if (!data.badge) {
    data.badge = "/logo-inverted.svg"
  }

  webpush.setGCMAPIKey(env.GCM_API_KEY ? env.GCM_API_KEY : null);
  webpush.setVapidDetails(
    'mailto:webmaster@noteqr.de',
    publicEnv.PUBLIC_VAPID_KEY,
    env.PRIVATE_VAPID_KEY,
  );

  await pbAuth()

  const filterString = userId == "ALL" ? "environment={:environment}" : "user.id={:userId} && environment={:environment}"

  const subscriptions = await pb.collection("pushSubscriptions").getFullList({
    filter: pb.filter(filterString, { userId, environment: env.NODE_ENV })
  })

  console.log(`[push] sending push messages to subscriptions of user ${userId}`)
  for (const subscription of subscriptions) {
    console.log(`[push] sending push message`)
    try {
      await webpush.sendNotification(subscription.subscription, JSON.stringify(data), { urgency: "high" });
    } catch (e) {
      console.error("error sending notification", e)
    }
  }

  return subscriptions.length
}
