import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function ArticlesPage() {
  const supabase = await createClient();
  
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>{articles?.length || 0} total articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles?.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{article.title}</h3>
                    <Badge variant={article.status === "published" ? "default" : "secondary"}>
                      {article.status}
                    </Badge>
                    {article.is_premium && (
                      <Badge variant="outline" className="text-accent border-accent">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    <span>{article.category}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/articles/${article.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {!articles?.length && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No articles yet</p>
                <Link href="/admin/articles/new">
                  <Button variant="link" className="mt-2">Create your first article</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
