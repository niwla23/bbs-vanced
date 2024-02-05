// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet

import { env } from "$env/dynamic/public";
import { getAuthenticatedPocketBase } from "./clientAuth";
import { sha256 } from "js-sha256"

// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}


export async function subscribeNotificationsClient() {
  console.log("diggah", navigator.serviceWorker)
  const registration = await navigator.serviceWorker.ready
  console.log("got registration")
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    console.log("no subscription")
    // Get the server's public key
    // const response = await fetch('/api/vapidPublicKey');
    const vapidPublicKey = env.PUBLIC_VAPID_KEY
    console.log("key", vapidPublicKey)
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);


    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });
  }

  // Keep your server in sync with the latest subscriptionId
  console.log(subscription)

  const hash = sha256(JSON.stringify(subscription))
  const pb = await getAuthenticatedPocketBase()
  const subscriptionsCollection = pb.collection("pushSubscriptions")
  try {
    const result = await subscriptionsCollection.getFirstListItem(pb.filter("subscriptionHash = {:hash}", { hash }))
    await subscriptionsCollection.update(result.id, {})
  } catch (e) {
    await subscriptionsCollection.create({ user: pb.authStore.model.id, subscription, subscriptionHash: hash, environment: process.env.NODE_ENV })
  }
}

