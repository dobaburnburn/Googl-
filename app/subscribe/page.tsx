import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PricingCards } from "@/components/pricing-cards";

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Pricing
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                Unlock Premium AI Insights
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                Choose the plan that fits your needs. Get unlimited access to premium content,
                exclusive tools, and in-depth analysis.
              </p>
            </div>
            
            <PricingCards />
            
            <div className="mt-16 text-center">
              <p className="text-muted-foreground text-sm">
                Simple monthly subscription. Cancel anytime.
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Secure payments powered by Square
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
