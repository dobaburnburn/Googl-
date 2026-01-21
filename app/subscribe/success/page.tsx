import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card border-border text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to Pro!</CardTitle>
            <CardDescription className="text-base">
              Your subscription is now active. You have full access to all premium content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50 text-left">
              <h3 className="font-medium mb-2">{"What's"} included:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Unlimited premium articles</li>
                <li>• Early access to new content</li>
                <li>• Ad-free reading experience</li>
                <li>• Exclusive AI tools & resources</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full">
                  Start Reading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="w-full bg-transparent">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
