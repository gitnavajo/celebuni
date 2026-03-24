import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogCardProps {
  title: string
  excerpt: string
  date: string
  slug: string
}

export function BlogCard({ title, excerpt, date, slug }: BlogCardProps) {
  return (
    <article className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card/80">
      {/* Subtle glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-primary/5" />
      
      <div className="relative">
        <time className="text-sm text-muted-foreground">{date}</time>
        
        <h2 className="mt-3 text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
          {title}
        </h2>
        
        <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        
        <Link 
          href={`/blog/${slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-200 hover:gap-3"
        >
          Read more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
