"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { Instagram, Twitter, Youtube, Gamepad, X, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = { label: string; href: string }

// --- NAVIGATION ITEMS ---
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Who am i?", href: "/about" },
  { label: "Past Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Achievements", href: "/achievements" },
]

const SPOTIFY_TRACK_ID = "71GtJ7jyfkNKbowx1H56Lw" 

// --- MAIN NAVBAR COMPONENT ---
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const dialogId = useId()
  const panelRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const spotifyRef = useRef<HTMLIFrameElement | null>(null)

  const handleVibeClick = () => {
    if (!showPlayer) {
      setShowPlayer(true)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
      // Send message to iframe to play/pause
      if (spotifyRef.current) {
        spotifyRef.current.contentWindow?.postMessage(
          { command: isPlaying ? "pause" : "play" },
          "https://open.spotify.com",
        )
      }
    }
  }

  // --- HOOKS for closing menu and preventing body scroll ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const onClickOutside = (e: MouseEvent) => {
      if (!open) return
      const target = e.target as Node
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.parentElement?.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClickOutside)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClickOutside)
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {showPlayer && (
        <div className="fixed bottom-4 right-4 z-60 bg-black rounded-lg p-2 shadow-2xl border-2 border-white max-w-[calc(100vw-2rem)]">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("w-2 h-2 rounded-full", isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
            <span className="text-white text-xs font-mono">Now {isPlaying ? "Playing" : "Paused"}</span>
            <button onClick={() => setShowPlayer(false)} className="text-white hover:text-gray-300 ml-auto">
              <X size={14} />
            </button>
          </div>
          <iframe
            ref={spotifyRef}
            src={`https://open.spotify.com/embed/playlist/${SPOTIFY_TRACK_ID}?utm_source=generator&theme=0`}
            width="280"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded w-full max-w-[280px]"
          />
        </div>
      )}

      {/* The nav is now transparent, floating over page content */}
      <nav className="relative mx-auto flex h-16 sm:h-18 lg:h-20 w-full max-w-7xl items-center justify-between px-5">
        {/* Left: Wordmark with improved typography */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0 mt-6 sm:mt-7 lg:mt-8">
          <Link href="/" className="group select-none flex-shrink-0 min-w-0" aria-label="Portfolio home">
            <span className="block font-black text-sm sm:text-base lg:text-3xl uppercase tracking-[-0.02em] text-black mix-blend-difference leading-none">
              Portfolio.
            </span>
            <span className="block font-mono text-[6px] sm:text-[7px] lg:text-[12px] uppercase tracking-[0.15em] text-black/70 mix-blend-difference mt-0.5">
              By Hrushikesh
            </span>
          </Link>
        </div>

        
        {
          !open && (
            <div className="absolute left-1/2 -top-1.5 -translate-x-1/2">
              <div className="h-8 w-15 sm:h-14 sm:w-36 lg:h-16 lg:w-40 rounded-b-[24px] sm:rounded-b-[32px] lg:rounded-b-[38px] border-b-2 border-l-2 border-r-2 border-black bg-white">
                <button
                  ref={buttonRef}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  aria-controls={dialogId}
                  onClick={() => setOpen((v) => !v)}
                  className={cn(
                    "group flex h-full w-full items-center justify-center rounded-b-[12px] sm:rounded-b-[14px] lg:rounded-b-[16px]",
                    "focus:outline-none focus:ring-2  focus:ring-offset-2 ",
                    "transition-all duration-200  active:scale-95"
                  )}
                >
                  <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
                  <div className="scale-[0.5] sm:scale-[0.55] lg:scale-[0.6]">
                    <Hamburger open={open} />
                  </div>
                </button>
              </div>
            </div>
          )
        }

        {/* Right: Action buttons */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-4 lg:gap-5 flex-shrink-0 mt-6 sm:mt-7 lg:mt-8">
          <Link
            href="/hire"
            className={cn(
              "relative inline-flex items-center justify-center rounded-full uppercase overflow-hidden",
              "bg-black text-white border-2 border-black",
              /* Reduced button sizes for desktop/tablet */
              "px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2 text-xs sm:text-sm lg:text-sm font-bold tracking-wide",
              "transition-all duration-200 hover:bg-white hover:text-black",
              "active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
              "before:absolute before:inset-0 before:bg-white before:scale-x-0 before:origin-left",
              "before:transition-transform before:duration-300 hover:before:scale-x-100",
              "min-w-[70px] sm:min-w-[75px] lg:min-w-[80px]",
            )}
          >
            <span className="relative z-10 font-mono tracking-[0.1em] whitespace-nowrap">Hire Me</span>
          </Link>
          <button
            onClick={handleVibeClick}
            className={cn(
              "relative inline-flex items-center justify-center rounded-full uppercase gap-2 overflow-hidden",
              "bg-white text-black border-2 border-black",
              /* Reduced button sizes for desktop/tablet */
              "px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2 text-xs sm:text-sm lg:text-sm font-bold tracking-wide",
              "transition-all duration-200 hover:bg-black hover:text-white",
              "active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
              "before:absolute before:inset-0 before:bg-black before:scale-x-0 before:origin-right",
              "before:transition-transform before:duration-300 hover:before:scale-x-100",
              "min-w-[60px] sm:min-w-[65px] lg:min-w-[70px]",
            )}
          >
            <span className="relative z-10 flex items-center gap-2 font-mono tracking-[0.1em] whitespace-nowrap">
              <span className={cn("transition-transform duration-200", isPlaying && "animate-pulse")}>
                {isPlaying ? <Pause size={12} className="sm:hidden" /> : <Play size={12} className="sm:hidden" />}
                {isPlaying ? (
                  <Pause size={14} className="hidden sm:block" />
                ) : (
                  <Play size={14} className="hidden sm:block" />
                )}
              </span>
              Vibe
            </span>
          </button>
        </div>

        {/* Mobile buttons */}
        <div className="flex sm:hidden items-center gap-3 flex-shrink-0 mt-6 sm:mt-7 lg:mt-8">
          <Link
            href="/hire"
            className="inline-flex items-center justify-center rounded-full bg-black text-white border-2 border-black px-2.5 py-1.5 text-[10px] font-bold hover:bg-white hover:text-black transition-all duration-200 active:scale-95 min-w-[50px] h-[30px]"
          >
            <span className="font-mono tracking-[0.1em] whitespace-nowrap">Hire Me</span>
          </Link>
          <button
            onClick={handleVibeClick}
            className="inline-flex items-center justify-center rounded-full bg-white text-black border-2 border-black px-2 py-1.5 text-[10px] font-bold hover:bg-black hover:text-white transition-all duration-200 active:scale-95 min-w-[30px] h-[30px]"
          >
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
          </button>
        </div>
      </nav>

      {/* Dim backdrop */}
      {open && (
        <div aria-hidden className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md" onClick={() => setOpen(false)} />
      )}

      {/* Smoother, Sliding Menu Panel */}
      <div
        role="dialog"
        aria-modal="true"
        id={dialogId}
        aria-label="Main menu"
        className={cn("relative z-50 flex w-full justify-center", open ? "pointer-events-auto" : "pointer-events-none")}
      >
        <div
          ref={panelRef}
          data-state={open ? "open" : "closed"}
          className={cn(
            "relative mt-2 sm:mt-4 w-[min(95vw,500px)] sm:w-[min(90vw,600px)] transition-all duration-700 ease-in-out",
            open ? "opacity-100 translate-y-12" : "opacity-0 -translate-y-24",
          )}
        >
          {/* Main panel body with hard border */}
          <div className="relative rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] border-2 border-black bg-white text-black">
            {/* Direct, functional close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 sm:right-4 top-3 sm:top-4 grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 active:scale-90"
              aria-label="Close menu"
            >
              <X size={18} className="sm:hidden" />
              <X size={20} className="hidden sm:block" />
            </button>

            <ul className="divide-y divide-black/10 px-4 sm:px-6 lg:px-10 pt-12 sm:pt-14">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex h-12 sm:h-14 lg:h-16 items-center text-sm sm:text-base lg:text-lg font-bold uppercase tracking-[0.05em] hover:translate-x-2 hover:opacity-70 transition-all duration-200 focus:outline-none focus:translate-x-2 focus:opacity-70"
                  >
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Action buttons in menu */}
            <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-5 border-t border-black/10">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="/hire"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 h-12 sm:h-14 items-center justify-center gap-2 rounded-full bg-black text-white border-2 border-black font-bold uppercase tracking-[0.1em] hover:bg-white hover:text-black transition-all duration-200 active:scale-95 text-sm sm:text-base"
                >
                  <span className="font-mono whitespace-nowrap">Hire Me</span>
                </a>
                <button
                  onClick={() => {
                    handleVibeClick()
                    setOpen(false)
                  }}
                  className="flex flex-1 h-12 sm:h-14 items-center justify-center gap-2 rounded-full bg-white text-black border-2 border-black font-bold uppercase tracking-[0.1em] hover:bg-black hover:text-white transition-all duration-200 active:scale-95 text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2 font-mono whitespace-nowrap">
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />} Vibe
                  </span>
                </button>
              </div>
            </div>

            {/* Socials row */}
            <div className="px-4 sm:px-6 lg:px-10 pb-4 sm:pb-6 pt-3">
              <div className="flex items-center justify-center gap-4 sm:gap-5 text-black">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200 active:scale-95 p-2"
                >
                  <Instagram size={20} className="sm:hidden" />
                  <Instagram size={24} className="hidden sm:block" />
                </a>
                <a
                  href="#"
                  aria-label="Game"
                  className="opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200 active:scale-95 p-2"
                >
                  <Gamepad size={20} className="sm:hidden" />
                  <Gamepad size={24} className="hidden sm:block" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200 active:scale-95 p-2"
                >
                  <Twitter size={20} className="sm:hidden" />
                  <Twitter size={24} className="hidden sm:block" />
                </a>
                <a
                  href="#"
                  aria-label="Youtube"
                  className="opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200 active:scale-95 p-2"
                >
                  <Youtube size={20} className="sm:hidden" />
                  <Youtube size={24} className="hidden sm:block" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// --- BRUTALIST PILL COMPONENT ---
function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full uppercase overflow-hidden",
        "bg-gradient-to-r from-emerald-400 to-cyan-400 text-black",
        "px-8 py-3 text-sm font-black tracking-wide shadow-lg",
        "transition-all duration-300 hover:scale-105 hover:shadow-xl",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-500 before:to-cyan-500",
        "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        "focus:outline-none focus:ring-4 focus:ring-emerald-300",
      )}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  )
}

// --- HAMBURGER ICON COMPONENT ---
function Hamburger({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative inline-flex h-4 w-6 items-center">
      <span
        className={cn(
          "absolute h-0.5 w-full bg-black transition-all duration-300 ease-in-out",
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
        )}
      />
      <span
        className={cn(
          "absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-black transition-opacity duration-200",
          open && "opacity-0",
        )}
      />
      <span
        className={cn(
          "absolute h-0.5 w-full bg-black transition-all duration-300 ease-in-out",
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
        )}
      />
    </span>
  )
}
