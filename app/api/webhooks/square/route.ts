import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body;

    console.log("[v0] Square webhook received:", event.type);

    // Handle payment completed event
    if (event.type === "payment.updated" && event.data?.object?.payment) {
      const payment = event.data.object.payment;

      // Check if payment is completed
      if (payment.status === "COMPLETED") {
        const customerId = payment.customer_id;
        const orderId = payment.order_id;
        const amount = payment.amount_money.amount / 100; // Convert cents to dollars

        console.log("[v0] Payment completed:", {
          customerId,
          orderId,
          amount,
        });

        // Find user by Square customer ID or order ID
        // For simplicity, we'll use the order_id which should contain user_id
        if (orderId) {
          const userId = orderId.split("_")[0]; // Assuming format: userId_timestamp

          // Update user's subscription in database
          const { error: subError } = await supabaseAdmin
            .from("subscriptions")
            .upsert({
              user_id: userId,
              plan_type: "premium",
              status: "active",
              payment_provider: "square",
              payment_id: payment.id,
              amount: amount,
              updated_at: new Date().toISOString(),
            });

          if (subError) {
            console.error("[v0] Error updating subscription:", subError);
          }

          // Update profile to mark as premium
          const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .update({ is_premium: true })
            .eq("id", userId);

          if (profileError) {
            console.error("[v0] Error updating profile:", profileError);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[v0] Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
