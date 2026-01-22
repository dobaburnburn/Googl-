"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopicSentiment {
  name: string;
  positive: number;
  neutral: number;
  negative: number;
  overall: string;
  score: number;
}

interface SentimentData {
  topics: TopicSentiment[];
  overall: {
    positive: number;
    neutral: number;
    negative: number;
    totalAnalyzed: number;
  };
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const COLORS = {
  positive: "#22c55e",
  neutral: "#6b7280",
  negative: "#ef4444",
};

const chartConfig = {
  positive: {
    label: "Positive",
    color: COLORS.positive,
  },
  neutral: {
    label: "Neutral",
    color: COLORS.neutral,
  },
  negative: {
    label: "Negative",
    color: COLORS.negative,
  },
};

function SentimentIcon({ sentiment }: { sentiment: string }) {
  if (sentiment === "positive") {
    return <TrendingUp className="h-5 w-5" />;
  }
  if (sentiment === "negative") {
    return <TrendingDown className="h-5 w-5" />;
  }
  return <Minus className="h-5 w-5" />;
}

export function SentimentDashboardMVP() {
  const { data, error, isLoading, mutate } = useSWR<SentimentData>(
    "/api/sentiment",
    fetcher,
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
    }
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Failed to load sentiment data. Please try again.
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-secondary rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-secondary rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">AI Sentiment Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Powered by Hugging Face NLP models
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 bg-transparent"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Updating..." : "Refresh"}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Positive
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {data.overall.positive}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of analyzed topics
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Neutral
              </CardTitle>
              <Minus className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-500">
              {data.overall.neutral}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of analyzed topics
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Negative
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {data.overall.negative}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of analyzed topics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Sentiment by Topic</CardTitle>
          <CardDescription>
            Real-time sentiment analysis of popular AI topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.topics}
                layout="vertical"
                margin={{ left: 100, right: 20, top: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal />
                <XAxis type="number" domain={[0, 100]} stroke="#888" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#888"
                  width={90}
                  style={{ fontSize: "14px" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                          <p className="font-semibold mb-2">{data.name}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-green-500">Positive:</span>
                              <span className="font-medium">{data.positive}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-gray-500">Neutral:</span>
                              <span className="font-medium">{data.neutral}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-red-500">Negative:</span>
                              <span className="font-medium">{data.negative}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="positive"
                  stackId="a"
                  fill={COLORS.positive}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="neutral"
                  stackId="a"
                  fill={COLORS.neutral}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="negative"
                  stackId="a"
                  fill={COLORS.negative}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Topic Details List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Topic Details</CardTitle>
          <CardDescription>Detailed breakdown of each AI topic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topics.map((topic) => (
              <div
                key={topic.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      topic.overall === "positive"
                        ? "text-green-500"
                        : topic.overall === "negative"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    <SentimentIcon sentiment={topic.overall} />
                  </div>
                  <div>
                    <p className="font-medium">{topic.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Score: {topic.score > 0 ? "+" : ""}
                      {topic.score}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-green-500 font-medium">
                    {topic.positive}%
                  </span>
                  <span className="text-gray-500 font-medium">
                    {topic.neutral}%
                  </span>
                  <span className="text-red-500 font-medium">
                    {topic.negative}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          Analyzed {data.overall.totalAnalyzed} data points across{" "}
          {data.topics.length} topics
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
