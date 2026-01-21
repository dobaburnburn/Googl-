import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, TrendingUp, Users } from "lucide-react";

export default async function BillingPage() {
  const supabase = await createClient();

  const { data: subscriptions, count } = await supabase
    .from("subscriptions")
    .select("*, profiles(full_name)", { count: "exact" })
    .order("created_at", { ascending: false });

  const activeSubscriptions = subscriptions?.filter(s => s.status === "active") || [];
  const proCount = activeSubscriptions.filter(s => s.plan_type === "pro").length;
  const enterpriseCount = activeSubscriptions.filter(s => s.plan_type === "enterprise").length;
  
  const monthlyRevenue = (proCount * 9) + (enterpriseCount * 29);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Monitor revenue and subscriptions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">From {activeSubscriptions.length} active subscribers</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pro Plans
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proCount}</div>
            <p className="text-xs text-muted-foreground mt-1">${proCount * 9}/mo</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enterprise Plans
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterpriseCount}</div>
            <p className="text-xs text-muted-foreground mt-1">${enterpriseCount * 29}/mo</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
          <CardDescription>All subscription records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {subscriptions?.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {(sub.profiles as unknown as { full_name: string })?.full_name || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sub.plan_type} plan • Started {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ${sub.plan_type === "pro" ? 9 : 29}/mo
                  </span>
                  <Badge
                    variant={sub.status === "active" ? "default" : "secondary"}
                    className={sub.status === "active" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {sub.status}
                  </Badge>
                </div>
              </div>
            ))}
            {!subscriptions?.length && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No subscriptions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
