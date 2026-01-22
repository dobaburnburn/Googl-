"use client";

import React from "react"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Loader2 } from "lucide-react";
import { createPayment } from "@/app/actions/square";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Square?: any;
  }
}

export default function PaymentPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [card, setCard] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function initializeSquare() {
      if (!window.Square) {
        setError("Square SDK failed to load");
        setLoading(false);
        return;
      }

      try {
        const payments = window.Square.payments(
          process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
          process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
        );

        const cardInstance = await payments.card();
        await cardInstance.attach("#card-container");
        setCard(cardInstance);
        setLoading(false);
      } catch (e: any) {
        console.error("[v0] Square initialization error:", e);
        setError("Failed to initialize payment form");
        setLoading(false);
      }
    }

    // Load Square SDK
    const script = document.createElement("script");
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.async = true;
    script.onload = () => initializeSquare();
    script.onerror = () => {
      setError("Failed to load Square SDK");
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!card) {
      setError("Payment form not initialized");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const result = await card.tokenize();
      
      if (result.status === "OK") {
        // Get current user (you'll need to implement this based on your auth)
        const userId = "temp-user-id"; // Replace with actual user ID from session
        
        const paymentResult = await createPayment(result.token, userId);
        
        if (paymentResult.success) {
          router.push("/subscribe/success");
        } else {
          setError(paymentResult.error || "Payment failed");
          setProcessing(false);
        }
      } else {
        setError("Card validation failed");
        setProcessing(false);
      }
    } catch (e: any) {
      console.error("[v0] Payment processing error:", e);
      setError("An error occurred during payment");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
              <CardDescription>
                Premium Plan - $1.99/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Card Information
                    </label>
                    <div 
                      id="card-container" 
                      className="min-h-[100px] p-4 border border-border rounded-md bg-background"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay $1.99"
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By confirming your subscription, you agree to our terms. Your card will be charged $1.99/month.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Secure payments powered by Square
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
