"use client";

import { X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface AdBannerProps {
  variant?: "inline" | "sidebar" | "banner";
}

export function AdBanner({ variant = "inline" }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (variant === "banner") {
    return (
      <div className="bg-secondary/80 border-y border-border py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Sponsored
            </span>
            <p className="text-sm">
              <span className="font-medium">Unlock your AI potential</span> - Try our Pro plan free for 7 days
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/subscribe"
              className="text-sm font-medium text-accent hover:underline"
            >
              Learn more
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Sponsored
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <div className="aspect-square bg-secondary rounded-md flex items-center justify-center mb-3">
          <span className="text-muted-foreground text-sm">Ad Space</span>
        </div>
        <p className="text-sm font-medium mb-2">Go Pro Today</p>
        <p className="text-xs text-muted-foreground mb-3">
          Get unlimited access to premium AI content and exclusive tools.
        </p>
        <Link
          href="/subscribe"
          className="text-xs font-medium text-accent hover:underline"
        >
          Start free trial
        </Link>
      </div>
    );
  }

  // Inline variant (default)
  return (
    <div className="rounded-lg border border-border bg-card p-6 my-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          Sponsored Content
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex gap-6 items-center">
        <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center shrink-0">
          <span className="text-muted-foreground text-xs">Ad</span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium mb-1">Upgrade to Pro</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Remove ads and get unlimited access to premium content, exclusive tools, and early access to new features.
          </p>
          <Link
            href="/subscribe"
            className="text-sm font-medium text-accent hover:underline"
          >
            Start your free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
