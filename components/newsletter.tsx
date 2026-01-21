"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Zap, Shield, Bell } from "lucide-react"
import { useState } from "react"

const features = [
  { icon: Zap, text: "Weekly AI insights" },
  { icon: Shield, text: "No spam, ever" },
  { icon: Bell, text: "Breaking news first" },
]

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1000)
  }

  return (
    <section id="newsletter" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Mail className="h-7 w-7 text-accent" />
              </div>
              
              <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Stay at the forefront of AI
              </h2>
              
              <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
                Join 25,000+ AI enthusiasts getting our weekly newsletter with curated insights, 
                research highlights, and exclusive content.
              </p>
              
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 flex-1 border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={status === "loading"}
                  className="h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <feature.icon className="h-4 w-4 text-accent" />
                    {feature.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
