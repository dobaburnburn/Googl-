"use client";

import { SentimentDashboard } from "@/components/sentiment-dashboard";

export default function AdminSentimentPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Sentiment Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Monitor real-time sentiment across AI topics using Hugging Face
        </p>
      </div>

      <SentimentDashboard />
    </div>
  );
}
