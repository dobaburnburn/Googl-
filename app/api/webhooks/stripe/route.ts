import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          plan_type: plan,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

        await supabaseAdmin
          .from("profiles")
          .update({ subscription_tier: plan })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const currentPeriodStart = subscription.current_period_start as unknown as number;
      const currentPeriodEnd = subscription.current_period_end as unknown as number;
      
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_start: new Date(currentPeriodStart * 1000).toISOString(),
          current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      // Get user from subscription
      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      if (sub) {
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_tier: "free" })
          .eq("id", sub.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
