import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SentimentDashboard } from "@/components/sentiment-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sentiment Analysis | The AI Grid",
  description:
    "Real-time sentiment analysis of popular AI topics powered by Hugging Face. Track public opinion on ChatGPT, Claude, Gemini, and more.",
  openGraph: {
    title: "AI Sentiment Analysis | The AI Grid",
    description:
      "Real-time sentiment tracking of AI topics powered by machine learning",
  },
};

export default function SentimentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <SentimentDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
