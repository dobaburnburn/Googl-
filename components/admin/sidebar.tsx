"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  LogOut,
  Grid3X3,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

interface AdminSidebarProps {
  user: User;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    subscription_tier: string;
  };
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/sentiment", label: "Sentiment", icon: Sparkles },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ user, profile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Grid3X3 className="h-6 w-6 text-accent" />
          <span className="font-bold text-lg">The AI Grid</span>
        </Link>
        <span className="text-xs text-muted-foreground mt-1 block">Admin Dashboard</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-sm font-medium text-accent">
              {profile.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile.full_name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
