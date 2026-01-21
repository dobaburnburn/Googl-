import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowUpRight } from "lucide-react"

interface ArticleCardProps {
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  featured?: boolean
  imageUrl?: string
  slug: string
}

export function ArticleCard({
  title,
  excerpt,
  category,
  readTime,
  date,
  featured = false,
  slug,
}: ArticleCardProps) {
  if (featured) {
    return (
      <Link href={`/article/${slug}`} className="group relative col-span-full overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/50 lg:col-span-2">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
              {category}
            </Badge>
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
          
          <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
            {title}
          </h2>
          
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground sm:text-lg">
            {excerpt}
          </p>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {readTime}
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-accent transition-colors group-hover:text-accent">
              Read article
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/article/${slug}`} className="group relative overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/50">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        
        <h3 className="mt-3 text-balance text-lg font-semibold tracking-tight text-card-foreground">
          {title}
        </h3>
        
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {readTime}
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
      </div>
    </Link>
  )
}
