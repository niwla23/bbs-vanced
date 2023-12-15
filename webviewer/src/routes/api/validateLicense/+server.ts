
import type { RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private'
import PocketBase from "pocketbase"

function sendJson(data: any, status?: number) {
  return new Response(JSON.stringify(data), { status: status || 200 })
}

function getOrderEmail(data: unknown) {
  let orderEmail = null
  try {
    orderEmail = data["license_key"]["order"]["email"]
  } catch (e) {
    console.log("no email found")
  }
  return orderEmail
}

export const GET: RequestHandler = async (event) => {
  const givenKey = event.url.searchParams.get("key")
  const accountId = event.url.searchParams.get("accountId")

  if (!givenKey || givenKey == null) return sendJson({ "error": "No key given" }, 500)
  if (!accountId || accountId == null) return sendJson({ "error": "No accountId given" }, 500)
  if (!env.LICENSE_SERVER_TOKEN) return sendJson({ "error": "no api token in env" }, 400)

  // check validity of key
  const endpointUrl = new URL("https://app-easy-product-downloads.fr/api/get-license-key")
  endpointUrl.searchParams.set("license_key", givenKey)
  endpointUrl.searchParams.set("api_token", env.LICENSE_SERVER_TOKEN)

  const result = await fetch(endpointUrl, { method: "POST" })

  const data = await result.json()
  if (data["status"] != "success") {
    return sendJson({ "error": "No such key", valid: false }, 400)
  }

  if (data["license_key"]["product"]["sku"] != "bbs-vanced-pro") {
    return sendJson({ "error": "Key invalid for this product", "valid": false }, 401)
  }

  // key is technically valid, connect to backend
  const pb = new PocketBase('https://bbs-backend.noteqr.de');
  pb.autoCancellation(false);
  await pb.collection('users').authWithPassword(env.PB_USER, env.PB_PASSWORD)


  // make sure key has not been linked to another account yet
  const usersWithThatKey = await pb.collection("users").getFullList({ filter: (pb.filter("proKey = {:givenKey}", { givenKey })) })
  if (usersWithThatKey.length > 0) {
    return sendJson({ "error": "Key already linked.", valid: false }, 409)
  }

  // log activation
  await pb.collection("activations").create({
    key: givenKey,
    email: getOrderEmail(data),
    account: accountId,
    environment: env.NODE_ENV
  })

  // save key to user account
  await pb.collection("users").update(accountId, { proKey: givenKey })

  event.setHeaders({ "cache-control": "max-age=0" })
  return sendJson({ valid: true, "error": null }, 200)
}
