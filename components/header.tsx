"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">AI</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">theaigrid.xyz</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="#articles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Articles
          </Link>
          <Link href="/sentiment" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Sentiment
          </Link>
          <Link href="/subscribe" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Premium
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
            Subscribe
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <Link href="/" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="#articles" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Articles
            </Link>
            <Link href="/sentiment" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Sentiment
            </Link>
            <Link href="/subscribe" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              Premium
            </Link>
            <Button variant="outline" className="w-full bg-transparent">Subscribe</Button>
          </nav>
        </div>
      )}
    </header>
  )
}
