"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createCheckoutSession(priceId: string, planName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get or create Stripe customer
  let customerId: string;
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) {
    customerId = profile.stripe_customer_id;
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        supabase_user_id: user.id,
      },
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `The AI Grid ${planName} Plan`,
            description: `Monthly subscription to The AI Grid ${planName}`,
          },
          unit_amount: planName === "Pro" ? 900 : 2900,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscribe`,
    metadata: {
      user_id: user.id,
      plan: planName.toLowerCase(),
    },
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    redirect("/subscribe");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin`,
  });

  redirect(session.url);
}
