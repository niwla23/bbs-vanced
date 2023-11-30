
import type { RequestHandler } from "@sveltejs/kit";
import { areSettingsComplete, getSettings } from '@/lib/settings';
import { getExamsServer } from "@/lib/exams";
import { env } from '$env/dynamic/private'

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

  event.setHeaders({ "cache-control": "max-age=0" })
  return sendJson({ valid: true, "error": null }, 200)
}
