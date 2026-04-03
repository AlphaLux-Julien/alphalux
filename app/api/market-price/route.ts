import { NextRequest, NextResponse } from "next/server"

const EBAY_TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token"
const EBAY_SEARCH_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search"

async function getEbayToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString("base64")

  const res = await fetch(EBAY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
  })

  if (!res.ok) throw new Error(`eBay auth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const brand = searchParams.get("brand")
  const reference = searchParams.get("reference")

  if (!brand || !reference) {
    return NextResponse.json({ error: "Missing brand or reference" }, { status: 400 })
  }

  try {
    const token = await getEbayToken()

    const url = new URL(EBAY_SEARCH_URL)
    url.searchParams.set("q", `${brand} ${reference}`)
    url.searchParams.set("category_ids", "31387") // Watches
    url.searchParams.set("limit", "5")
    url.searchParams.set("sort", "newlyListed")

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_FR",
      },
    })

    if (!res.ok) throw new Error(`eBay search failed: ${res.status}`)

    const data = await res.json()
    const items: any[] = data.itemSummaries || []

    const prices = items
      .map((item: any) => Number(item.price?.value))
      .filter((p) => !isNaN(p) && p > 0)

    if (prices.length === 0) {
      return NextResponse.json({ price: null, count: 0 })
    }

    const average = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length)

    return NextResponse.json({ price: average, count: prices.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
