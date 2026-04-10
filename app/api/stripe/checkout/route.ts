import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })
    const { plan } = await req.json()

    const priceMap: Record<string, string | undefined> = {
      monthly: process.env.STRIPE_PRICE_MONTHLY_ID,
      yearly: process.env.STRIPE_PRICE_YEARLY_ID,
    }
    const priceId = priceMap[plan]
    if (!priceId) return NextResponse.json({ error: "Plan invalide" }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get("authorization") || "" } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: { user_id: user.id },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://alphalux.fr/pricing/success",
      cancel_url: "https://alphalux.fr/pricing/cancel",
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
