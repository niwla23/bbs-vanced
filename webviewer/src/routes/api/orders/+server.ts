import type { RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public';
import { logEvent, pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import { generateAccessToken } from "./shared";


// const base = "https://api-m.sandbox.paypal.com";
const base = env.PAYPAL_BASE_URL


export const POST: RequestHandler = async (event) => {
  const userId = event.url.searchParams.get("userId")
  if (!userId || userId == "") return sendJson({ "error": "no userId param given" }, 400)
  let promoCode = event.url.searchParams.get("promoCode")

  await pbAuth()

  let price = publicEnv.PUBLIC_PRO_PRICE
  let promoCodeId = null

  if (promoCode) {
    const results = await pb.collection("promoCodes").getFullList({ filter: (pb.filter("code = {:promoCode}", { promoCode })) })
    if (results.length != 0) {
      price = results[0].price
      promoCodeId = results[0].id
    } else {
      // reset promo code if it is invalid
      promoCode = ""
    }
  }

  fetch("http://ntfy.sh/506f633d-ab54-4bfb-8c72-71aaa5727832_ohfuck_bigmac", { method: "POST", body: "BBS Vanced PRO Order created" })

  const accessToken = await generateAccessToken(base);
  const url = `${base}/v2/checkout/orders`;
  const customId = `${userId}-${new Date().toJSON()}`
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        custom_id: customId,
        amount: {
          currency_code: "EUR",
          value: price,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const jsonData = await response.json();
  await pb.collection("orders").create({ promoCode: promoCodeId, price, customId, captured: false, environment: env.NODE_ENV, paypalId: jsonData.id })

  event.setHeaders({ "cache-control": "max-age=0" })
  try {
    // const jsonResponse = await response.json();
    return sendJson(jsonData, response.status)
  } catch (err) {
    const errorMessage = await response.text();
    console.error("failed to create order", errorMessage)
    return sendJson({ error: "Failed to create order." }, 500)
  }

  // logEvent("exams", { className: className, date, url: event.url.toString() })
}
