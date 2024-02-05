import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import webpush from "web-push"
import { pb, pbAuth } from "./serverHelpers";

interface Payload extends NotificationOptions {
  title: string
}

export async function sendNotification(userId: string, data: Payload) {
  webpush.setGCMAPIKey(env.GCM_API_KEY ? env.GCM_API_KEY : null);
  webpush.setVapidDetails(
    'mailto:webmaster@noteqr.de',
    publicEnv.PUBLIC_VAPID_KEY,
    env.PRIVATE_VAPID_KEY,
  );

  pbAuth()
  const subscriptions = await pb.collection("pushSubscriptions").getFullList({
    filter: pb.filter("user.id={:userId} && environment={:environment}", { userId, environment: env.NODE_ENV })
  })

  for (const subscription of subscriptions) {
    console.log("sending")
    await webpush.sendNotification(subscription.subscription, JSON.stringify(data));
  }
}
