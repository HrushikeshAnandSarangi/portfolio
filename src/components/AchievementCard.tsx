"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

type Achievement = {
  title: string
  issuer?: string
  event?: string
  year?: string
  placement?: string
  description?: string
  tags?: string[]
  href?: string
}

export function AchievementCard({ title, issuer, event, year, placement, description, tags = [], href }: Achievement) {
  return (
    <article
      className={cn(
        "group relative rounded-[16px] border-2 border-black bg-white text-black",
        "p-4 sm:p-5 lg:p-6 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000]",
        "focus-within:shadow-[4px_4px_0_0_#000]",
      )}
    >
      <header className="mb-3">
        <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase leading-tight tracking-[0.02em]">
          {title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          {event && <span className="font-mono uppercase">{event}</span>}
          {issuer && <span className="font-mono uppercase">{issuer}</span>}
          {placement && (
            <span className="rounded-full border-2 border-black px-2 py-0.5 font-mono uppercase bg-white">
              {placement}
            </span>
          )}
          {year && <span className="text-black/60 font-mono">· {year}</span>}
        </div>
      </header>

      {description && <p className="text-sm sm:text-base leading-relaxed text-black/80">{description}</p>}

      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li
              key={t}
              className="inline-flex items-center rounded-full border-2 border-black bg-white px-2 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wide"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {href && (
        <div className="mt-4">
          <Link
            href={href}
            className={cn(
              "inline-flex items-center justify-center rounded-full uppercase overflow-hidden",
              "bg-black text-white border-2 border-black px-3 py-1.5 text-xs font-bold tracking-wide",
              "transition-all duration-200 hover:bg-white hover:text-black active:scale-95",
            )}
          >
            View Credential
          </Link>
        </div>
      )}
    </article>
  )
}
