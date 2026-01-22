"use client";

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for casual readers",
    features: [
      "Access to free articles",
      "Weekly newsletter",
      "Community access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    price: 1.99,
    description: "Unlock all premium features",
    features: [
      "All free features",
      "Unlimited premium articles",
      "Early access to content",
      "Ad-free experience",
      "Sentiment analysis dashboard",
    ],
    cta: "Subscribe Now",
    popular: true,
  },
];

export function PricingCards() {
  const handleSubscribe = (plan: typeof plans[0]) => {
    if (plan.price === 0) {
      window.location.href = "/auth/signup";
      return;
    }
    
    // Navigate to payment page for premium
    window.location.href = "/payment";
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative bg-card border-border ${
            plan.popular ? "border-accent ring-1 ring-accent" : ""
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                <Zap className="h-3 w-3" />
                Most Popular
              </span>
            </div>
          )}
          
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">${plan.price}</span>
              {plan.price > 0 && (
                <span className="text-muted-foreground">/month</span>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              className={`w-full ${
                plan.popular
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : ""
              }`}
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handleSubscribe(plan)}
            >
              {plan.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
