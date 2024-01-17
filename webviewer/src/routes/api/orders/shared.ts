import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public"

/**
* Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
* @see https://developer.paypal.com/api/rest/authentication/
*/
export const generateAccessToken = async (base: string) => {
  try {
    if (!publicEnv.PUBLIC_PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }

    const auth = Buffer.from(publicEnv.PUBLIC_PAYPAL_CLIENT_ID + ":" + env.PAYPAL_CLIENT_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};
