
import type { RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private'
import PocketBase from "pocketbase"

function sendJson(data: any, status?: number) {
  return new Response(JSON.stringify(data), { status: status || 200 })
}

export const GET: RequestHandler = async (event) => {
  const givenKey = event.url.searchParams.get("key")

  if (!givenKey) return sendJson({ "error": "No key given" }, 500)
  if (!env.LICENSE_SERVER_TOKEN) return sendJson({ "error": "no api token in env" }, 400)

  const endpointUrl = new URL("https://app-easy-product-downloads.fr/api/get-license-key")
  endpointUrl.searchParams.set("license_key", givenKey)
  endpointUrl.searchParams.set("api_token", env.LICENSE_SERVER_TOKEN)

  const result = await fetch(endpointUrl, {
    method: "POST"
  })

  const data = await result.json()
  console.log(data)
  if (data["status"] != "success") {
    return sendJson({ "error": "No such key", valid: false }, 400)
  }

  if (data["license_key"]["product"]["sku"] != "bbs-vanced-pro") {
    return sendJson({ "error": "Key invalid for this product", "valid": false }, 401)
  }

  const pb = new PocketBase('https://bbs-backend.noteqr.de');
  pb.autoCancellation(false);
  await pb.collection('users').authWithPassword(env.PB_USER, env.PB_PASSWORD)

  let orderEmail = null
  try {
    orderEmail = data["license_key"]["order"]["email"]
  } catch (e) {
    console.log("no email found")
  }

  console.log(givenKey, orderEmail, env.NODE_ENV)

  await pb.collection("activations").create({
    key: givenKey,
    email: orderEmail,
    environment: env.NODE_ENV
  })

  event.setHeaders({ "cache-control": "max-age=0" })
  return sendJson({ valid: true, "error": null }, 200)
}
