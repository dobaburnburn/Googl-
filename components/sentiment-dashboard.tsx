"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Sparkles,
  BarChart3,
  PieChartIcon,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopicSentiment {
  name: string;
  positive: number;
  neutral: number;
  negative: number;
  overall: string;
  score: number;
}

interface TrendData {
  day: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentData {
  topics: TopicSentiment[];
  trends: TrendData[];
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
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  }
  if (sentiment === "negative") {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-gray-500" />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-secondary rounded-lg" />
        ))}
      </div>
      <div className="h-80 bg-secondary rounded-lg" />
      <div className="h-80 bg-secondary rounded-lg" />
    </div>
  );
}

export function SentimentDashboard() {
  const { data, error, isLoading, mutate } = useSWR<SentimentData>(
    "/api/sentiment",
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
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
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Failed to load sentiment data. Please try again later.
      </div>
    );
  }

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  const pieData = [
    { name: "Positive", value: data.overall.positive, fill: COLORS.positive },
    { name: "Neutral", value: data.overall.neutral, fill: COLORS.neutral },
    { name: "Negative", value: data.overall.negative, fill: COLORS.negative },
  ];

  const radarData = data.topics.slice(0, 6).map((topic) => ({
    topic: topic.name,
    sentiment: topic.score + 50, // Normalize to 0-100 scale
  }));

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI Sentiment Analysis
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time sentiment tracking powered by Hugging Face
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
          Refresh
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Positive Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold text-green-500">
                {data.overall.positive}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Neutral Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-gray-500" />
              <span className="text-3xl font-bold text-gray-500">
                {data.overall.neutral}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Negative Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="text-3xl font-bold text-red-500">
                {data.overall.negative}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Topics Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              <span className="text-3xl font-bold">
                {data.overall.totalAnalyzed}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different chart views */}
      <Tabs defaultValue="topics" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="topics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            By Topic
          </TabsTrigger>
          <TabsTrigger value="distribution" className="gap-2">
            <PieChartIcon className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <Activity className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="radar" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Comparison
          </TabsTrigger>
        </TabsList>

        {/* By Topic - Stacked Bar Chart */}
        <TabsContent value="topics">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Sentiment by AI Topic</CardTitle>
              <CardDescription>
                Breakdown of sentiment across popular AI topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart
                  data={data.topics}
                  layout="vertical"
                  margin={{ left: 80, right: 20, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" domain={[0, 100]} stroke="#888" />
                  <YAxis dataKey="name" type="category" stroke="#888" width={70} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="positive"
                    stackId="a"
                    fill={COLORS.positive}
                    name="Positive"
                  />
                  <Bar
                    dataKey="neutral"
                    stackId="a"
                    fill={COLORS.neutral}
                    name="Neutral"
                  />
                  <Bar
                    dataKey="negative"
                    stackId="a"
                    fill={COLORS.negative}
                    name="Negative"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution - Pie Chart */}
        <TabsContent value="distribution">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Overall Sentiment Distribution</CardTitle>
                <CardDescription>
                  Aggregate sentiment across all AI topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Top Positive Topics</CardTitle>
                <CardDescription>
                  AI topics with the most positive sentiment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topics.slice(0, 5).map((topic, index) => (
                    <div key={topic.name} className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{topic.name}</span>
                          <div className="flex items-center gap-1">
                            <SentimentIcon sentiment={topic.overall} />
                            <span
                              className={`text-sm font-medium ${
                                topic.overall === "positive"
                                  ? "text-green-500"
                                  : topic.overall === "negative"
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {topic.score > 0 ? "+" : ""}
                              {topic.score}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
                          <div
                            className="bg-green-500 h-full"
                            style={{ width: `${topic.positive}%` }}
                          />
                          <div
                            className="bg-gray-500 h-full"
                            style={{ width: `${topic.neutral}%` }}
                          />
                          <div
                            className="bg-red-500 h-full"
                            style={{ width: `${topic.negative}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends - Line Chart */}
        <TabsContent value="trends">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>7-Day Sentiment Trend</CardTitle>
              <CardDescription>
                How AI sentiment has changed over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <LineChart
                  data={data.trends}
                  margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis domain={[0, 100]} stroke="#888" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke={COLORS.positive}
                    strokeWidth={2}
                    dot={{ fill: COLORS.positive }}
                    name="Positive"
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    stroke={COLORS.neutral}
                    strokeWidth={2}
                    dot={{ fill: COLORS.neutral }}
                    name="Neutral"
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke={COLORS.negative}
                    strokeWidth={2}
                    dot={{ fill: COLORS.negative }}
                    name="Negative"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Radar - Topic Comparison */}
        <TabsContent value="radar">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Topic Sentiment Comparison</CardTitle>
              <CardDescription>
                Radar view of sentiment scores across top AI topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sentiment: {
                    label: "Sentiment Score",
                    color: "hsl(var(--accent))",
                  },
                }}
                className="h-[400px]"
              >
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="topic" stroke="#888" />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#888"
                  />
                  <Radar
                    name="Sentiment"
                    dataKey="sentiment"
                    stroke="hsl(173 58% 39%)"
                    fill="hsl(173 58% 39%)"
                    fillOpacity={0.5}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last updated */}
      <p className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(data.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
