import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

export const SUBSCRIPTION_PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "Access to free articles",
      "Weekly newsletter",
      "Community access",
    ],
  },
  pro: {
    name: "Pro",
    priceId: "price_pro_monthly",
    price: 9,
    features: [
      "All free features",
      "Unlimited premium articles",
      "Early access to content",
      "Ad-free experience",
      "Exclusive AI tools & resources",
    ],
  },
  enterprise: {
    name: "Enterprise",
    priceId: "price_enterprise_monthly",
    price: 29,
    features: [
      "All Pro features",
      "Team access (up to 10 users)",
      "Priority support",
      "Custom AI integrations",
      "API access",
      "White-label options",
    ],
  },
};
