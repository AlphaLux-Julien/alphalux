import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get("authorization") || "" } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    // Récupère le stripe_customer_id depuis la table users
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: profile, error } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (error || !profile?.stripe_customer_id) {
      console.error("[portal] stripe_customer_id introuvable pour user", user.id)
      return NextResponse.json({ error: "Aucun abonnement trouvé" }, { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: "https://www.alphalux.fr",
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("[portal] Erreur:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
