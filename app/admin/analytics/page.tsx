import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, Clock, FileText } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    { data: pageViews7d },
    { data: pageViews30d },
    { data: topArticles },
    { data: recentViews },
  ] = await Promise.all([
    supabase.from("page_views").select("*").gte("viewed_at", sevenDaysAgo.toISOString()),
    supabase.from("page_views").select("*").gte("viewed_at", thirtyDaysAgo.toISOString()),
    supabase.from("articles").select("*").order("views", { ascending: false }).limit(10),
    supabase.from("page_views").select("*, articles(title)").order("viewed_at", { ascending: false }).limit(20),
  ]);

  const totalViews7d = pageViews7d?.length || 0;
  const totalViews30d = pageViews30d?.length || 0;
  const avgViewsPerDay = Math.round(totalViews30d / 30);

  // Calculate unique visitors (by session_id)
  const uniqueVisitors7d = new Set(pageViews7d?.map(v => v.session_id)).size;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your blog performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Views (7 days)
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews7d}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Views (30 days)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews30d}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Visitors (7d)
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors7d}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Daily Views
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgViewsPerDay}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Top Articles</CardTitle>
            <CardDescription>Most viewed articles of all time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topArticles?.map((article, index) => (
                <div key={article.id} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-muted-foreground w-8">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">{article.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="text-sm">{article.views}</span>
                  </div>
                </div>
              ))}
              {!topArticles?.length && (
                <p className="text-muted-foreground text-center py-4">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest page views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentViews?.map((view) => (
                <div key={view.id} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1 mr-4">
                    {(view.articles as unknown as { title: string })?.title || "Home Page"}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(view.viewed_at).toLocaleString()}
                  </span>
                </div>
              ))}
              {!recentViews?.length && (
                <p className="text-muted-foreground text-center py-4">No activity yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
