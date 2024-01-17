import type { RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private'
import { logEvent, pb, pbAuth, sendJson } from "@/lib/serverHelpers";
import { generateAccessToken } from "../shared";


// const base = "https://api-m.sandbox.paypal.com";
const base = env.PAYPAL_BASE_URL


export const POST: RequestHandler = async (event) => {
  const orderId = event.url.searchParams.get("orderId")
  if (!orderId || orderId == null) {
    return sendJson({ "error": "no orderId param given" }, 400)
  }

  const accessToken = await generateAccessToken(base);
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });


  event.setHeaders({ "cache-control": "max-age=0" })
  try {
    const jsonResponse = await response.json();

    if (response.status == 201) {
      console.log("succesful purchase")
      await pbAuth()
      const userId = jsonResponse.purchase_units[0].payments.captures[0].custom_id.split("-")[0]
      await pb.collection("users").update(userId, { proKey: `paypal-${new Date().toJSON()}` })
    }

    return sendJson(jsonResponse, response.status)
  } catch (err) {
    const errorMessage = await response.text();
    return sendJson({ error: errorMessage }, 500)
  }

  // logEvent("exams", { className: className, date, url: event.url.toString() })
}
