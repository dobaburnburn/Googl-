import { ArticleCard } from "@/components/article-card"

const articles = [
  {
    title: "Understanding GPT-5: A Deep Dive into OpenAI's Latest Model",
    excerpt: "OpenAI's GPT-5 represents a quantum leap in language understanding and generation. We explore its architecture, capabilities, and what it means for the future of AI.",
    category: "Research",
    readTime: "12 min read",
    date: "Jan 18, 2026",
    featured: true,
    slug: "understanding-gpt-5",
  },
  {
    title: "The Rise of AI Agents in Enterprise Software",
    excerpt: "How autonomous AI agents are transforming business operations and decision-making processes.",
    category: "Industry",
    readTime: "8 min read",
    date: "Jan 17, 2026",
    slug: "ai-agents-enterprise",
  },
  {
    title: "Building RAG Systems: A Practical Guide",
    excerpt: "Learn how to implement Retrieval-Augmented Generation for more accurate AI responses.",
    category: "Tutorial",
    readTime: "15 min read",
    date: "Jan 16, 2026",
    slug: "building-rag-systems",
  },
  {
    title: "Claude 4 vs GPT-5: An In-Depth Comparison",
    excerpt: "We benchmark the latest models from Anthropic and OpenAI across multiple dimensions.",
    category: "Analysis",
    readTime: "10 min read",
    date: "Jan 15, 2026",
    slug: "claude-4-vs-gpt-5",
  },
  {
    title: "The Ethics of AI Art Generation",
    excerpt: "Exploring the complex ethical landscape of AI-generated creative content and copyright.",
    category: "Opinion",
    readTime: "7 min read",
    date: "Jan 14, 2026",
    slug: "ethics-ai-art",
  },
  {
    title: "Multimodal AI: Beyond Text and Images",
    excerpt: "How the latest AI models are integrating video, audio, and 3D understanding.",
    category: "Research",
    readTime: "9 min read",
    date: "Jan 13, 2026",
    slug: "multimodal-ai-future",
  },
  {
    title: "Fine-Tuning LLMs: Best Practices for 2026",
    excerpt: "Updated strategies for customizing large language models for specific use cases.",
    category: "Tutorial",
    readTime: "11 min read",
    date: "Jan 12, 2026",
    slug: "fine-tuning-llms-2026",
  },
]

export function ArticlesGrid() {
  return (
    <section id="articles" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Latest Articles</h2>
            <p className="mt-2 text-muted-foreground">Insights and analysis from the frontier of AI</p>
          </div>
          <a href="#" className="text-sm font-medium text-accent hover:text-accent/80">
            View all articles
          </a>
        </div>
        
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      </div>
    </section>
  )
}
