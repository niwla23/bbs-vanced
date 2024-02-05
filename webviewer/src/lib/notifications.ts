export async function subscribeNotificationsClient() {
  console.log("diggah", navigator.serviceWorker)
  const serviceWorkerRegistration = await navigator.serviceWorker.ready
  console.log("got registration")
  const subscription = serviceWorkerRegistration.pushManager.getSubscription()
  if (!subscription) {
    // We aren't subscribed to push, so set UI
    // to allow the user to enable push
    console.log("no subscription")
    return;
  }

  // Keep your server in sync with the latest subscriptionId
  console.log(subscription)
}
