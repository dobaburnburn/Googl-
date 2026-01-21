import Link from "next/link"
import { Brain, Code, Lightbulb, Newspaper, BookOpen, Cpu } from "lucide-react"

const categories = [
  {
    name: "Research",
    description: "Latest breakthroughs and papers",
    icon: Brain,
    count: 47,
    href: "/category/research",
  },
  {
    name: "Tutorials",
    description: "Hands-on guides and how-tos",
    icon: Code,
    count: 32,
    href: "/category/tutorials",
  },
  {
    name: "Industry",
    description: "Business and market insights",
    icon: Newspaper,
    count: 28,
    href: "/category/industry",
  },
  {
    name: "Opinion",
    description: "Expert perspectives and debates",
    icon: Lightbulb,
    count: 19,
    href: "/category/opinion",
  },
  {
    name: "Deep Dives",
    description: "In-depth technical analysis",
    icon: BookOpen,
    count: 24,
    href: "/category/deep-dives",
  },
  {
    name: "Tools",
    description: "AI tools and platforms reviewed",
    icon: Cpu,
    count: 15,
    href: "/category/tools",
  },
]

export function Categories() {
  return (
    <section id="tutorials" className="border-y border-border bg-secondary/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore Topics</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Dive into our comprehensive coverage across all areas of artificial intelligence
          </p>
        </div>
        
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-card/80"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <category.icon className="h-6 w-6 text-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{category.count} articles</span>
              </div>
              
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{category.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
