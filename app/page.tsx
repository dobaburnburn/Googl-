import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ArticlesGrid } from "@/components/articles-grid"
import { Categories } from "@/components/categories"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { AdBanner } from "@/components/ad-banner"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AdBanner variant="leaderboard" />
        <ArticlesGrid />
        <AdBanner variant="banner" />
        <Categories />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
