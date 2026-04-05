import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const auth = req.headers.get("Authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: watches, error } = await supabase
    .from("watches")
    .select("id, user_id, brand, reference")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const eligible = (watches ?? []).filter((w) => w.brand && w.reference)

  let updated = 0
  let skipped = 0

  const baseUrl = req.nextUrl.origin

  for (const watch of eligible) {
    try {
      const res = await fetch(
        `${baseUrl}/api/market-price?brand=${encodeURIComponent(watch.brand)}&reference=${encodeURIComponent(watch.reference)}`
      )
      const data = await res.json()

      if (!data.price) { skipped++; continue }

      const { error: updateError } = await supabase
        .from("watches")
        .update({ current_value: data.price })
        .eq("id", watch.id)

      if (updateError) { skipped++; continue }

      await supabase.from("price_history").insert([{
        watch_id: watch.id,
        user_id: watch.user_id,
        value: data.price,
      }])

      updated++
    } catch {
      skipped++
    }
  }

  return NextResponse.json({ updated, skipped, total: eligible.length })
}
