
import type { RequestHandler } from "@sveltejs/kit";
import { pb, pbAuth, sendJson } from "@/lib/serverHelpers";

export const GET: RequestHandler = async (event) => {
  const givenCode = event.url.searchParams.get("code")

  if (!givenCode || givenCode == null) return sendJson({ "error": "No code given" }, 500)

  await pbAuth()
  const results = await pb.collection("promoCodes").getFullList({ filter: (pb.filter("code = {:givenCode}", { givenCode })) })
  if (results.length == 0) {
    return sendJson({ "error": "No such code", valid: false }, 404)
  }

  event.setHeaders({ "cache-control": "max-age=0" })
  return sendJson({ valid: true, price: results[0].price, "error": null }, 200)
}
