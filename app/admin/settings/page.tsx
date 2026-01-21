"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your blog settings</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic configuration for your blog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                defaultValue="The AI Grid"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                defaultValue="Exploring the Future of Artificial Intelligence"
                className="bg-secondary border-border"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                defaultValue="https://theaigrid.xyz"
                className="bg-secondary border-border"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Monetization</CardTitle>
            <CardDescription>Configure ads and subscription settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <Label className="text-sm font-medium">Enable Ads</Label>
                <p className="text-xs text-muted-foreground">Show ads to free users</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <Label className="text-sm font-medium">Premium Content Wall</Label>
                <p className="text-xs text-muted-foreground">Require subscription for premium articles</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripeKey">Stripe Publishable Key</Label>
              <Input
                id="stripeKey"
                type="password"
                placeholder="pk_live_..."
                className="bg-secondary border-border"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Configure tracking and analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gaId">Google Analytics ID</Label>
              <Input
                id="gaId"
                placeholder="G-XXXXXXXXXX"
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">
                Enter your Google Analytics 4 Measurement ID
              </p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <Label className="text-sm font-medium">Internal Analytics</Label>
                <p className="text-xs text-muted-foreground">Track page views in database</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/theaigrid"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/company/theaigrid"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                placeholder="https://github.com/theaigrid"
                className="bg-secondary border-border"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
