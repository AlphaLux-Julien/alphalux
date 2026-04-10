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
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    if (userId) {
      await supabase.from("users").upsert({ id: userId, subscription_status: "active" }, { onConflict: "id" })
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.paused") {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    // TODO: stocker stripe_customer_id dans users pour pouvoir mettre à jour le statut ici
    console.error(`[webhook] ${event.type} non géré pour customer ${customerId} — stripe_customer_id non stocké`)
  }

  return NextResponse.json({ received: true })
}
