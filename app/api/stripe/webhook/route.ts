import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("[webhook] Signature invalide:", err.message)
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  // Service role key obligatoire pour bypasser le RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Identification par metadata.user_id (prioritaire) ou par email en fallback
    let userId = session.metadata?.user_id ?? null
    const email = session.customer_details?.email ?? session.customer_email ?? null

    if (!userId && email) {
      const { data: authUser, error: authError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single()

      if (authError) {
        console.error("[webhook] Impossible de retrouver l'user par email:", email, authError.message)
      } else {
        userId = authUser?.id ?? null
      }
    }

    if (!userId) {
      console.error("[webhook] checkout.session.completed — user_id introuvable. session_id:", session.id, "email:", email)
      return NextResponse.json({ received: true })
    }

    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null

    const { error: upsertError } = await supabase
      .from("users")
      .upsert(
        { id: userId, subscription_status: "active", stripe_customer_id: customerId },
        { onConflict: "id" }
      )

    if (upsertError) {
      console.error("[webhook] Échec mise à jour subscription_status pour user", userId, ":", upsertError.message)
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.paused") {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    // stripe_customer_id maintenant stocké — TODO: retrouver l'user par stripe_customer_id et passer subscription_status à "inactive"
    console.error(`[webhook] ${event.type} non géré pour customer ${customerId}`)
  }

  return NextResponse.json({ received: true })
}
