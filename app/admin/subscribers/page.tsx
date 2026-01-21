import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SubscribersPage() {
  const supabase = await createClient();
  
  const { data: subscribers, count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("subscribed_at", { ascending: false });

  const activeCount = subscribers?.filter(s => s.status === "active").length || 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-muted-foreground mt-1">Manage your email list</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscribers
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscribers
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unsubscribed
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(count || 0) - activeCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Subscribers</CardTitle>
          <CardDescription>People who subscribed to your newsletter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {subscribers?.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-accent">
                      {subscriber.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{subscriber.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Subscribed {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={subscriber.status === "active" ? "default" : "secondary"}>
                  {subscriber.status}
                </Badge>
              </div>
            ))}
            {!subscribers?.length && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No subscribers yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
