import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Eye, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: articlesCount },
    { count: subscribersCount },
    { count: usersCount },
    { data: recentArticles },
    { data: pageViews },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("page_views").select("*").gte("viewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const totalViews = pageViews?.length || 0;
  
  // Calculate mock revenue based on subscribers
  const estimatedRevenue = (subscribersCount || 0) * 9 * 0.1; // Assume 10% conversion at $9/mo

  const stats = [
    {
      title: "Total Articles",
      value: articlesCount || 0,
      icon: FileText,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Newsletter Subscribers",
      value: subscribersCount || 0,
      icon: Users,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Page Views (7d)",
      value: totalViews,
      icon: Eye,
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      title: "Est. Monthly Revenue",
      value: `$${estimatedRevenue.toFixed(0)}`,
      icon: DollarSign,
      change: "+15%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! {"Here's"} an overview of your blog performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-accent mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>Your latest published content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles?.map((article) => (
                <div key={article.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.created_at).toLocaleDateString()} • {article.read_time} min read
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="text-xs">{article.views}</span>
                  </div>
                </div>
              ))}
              {!recentArticles?.length && (
                <p className="text-sm text-muted-foreground">No articles yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/articles/new"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <span className="text-sm font-medium">Create New Article</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="/admin/subscribers"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <span className="text-sm font-medium">View Subscribers</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="/admin/analytics"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <span className="text-sm font-medium">View Analytics</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="/subscribe"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <span className="text-sm font-medium">Preview Pricing Page</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
