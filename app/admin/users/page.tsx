import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, UserCheck } from "lucide-react";

export default async function UsersPage() {
  const supabase = await createClient();
  
  const { data: profiles, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const proCount = profiles?.filter(p => p.subscription_tier === "pro").length || 0;
  const enterpriseCount = profiles?.filter(p => p.subscription_tier === "enterprise").length || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Manage your user base</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pro Subscribers
            </CardTitle>
            <Crown className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enterprise
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterpriseCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Registered users on your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profiles?.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-accent">
                      {profile.full_name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{profile.full_name || "Unknown User"}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {profile.is_admin && (
                    <Badge variant="outline" className="text-accent border-accent">
                      Admin
                    </Badge>
                  )}
                  <Badge
                    variant={profile.subscription_tier === "free" ? "secondary" : "default"}
                    className={profile.subscription_tier !== "free" ? "bg-accent text-accent-foreground" : ""}
                  >
                    {profile.subscription_tier}
                  </Badge>
                </div>
              </div>
            ))}
            {!profiles?.length && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No users yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
