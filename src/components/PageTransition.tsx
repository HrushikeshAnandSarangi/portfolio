"use client"

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import type { ReactNode } from "react"
import { useRef, useEffect, useState } from "react"

interface PageTransitionProps {
  children: ReactNode
  className?: string
  variant?: "fade" | "slide" | "scale" | "blur" | "scroll-sticky" | "custom"
  duration?: number
  delay?: number
  customVariants?: {
    initial: any
    animate: any
    exit: any
  }
  scrollOffset?: [string, string] // e.g., ["start end", "end start"]
  stickyRange?: [number, number] // e.g., [0, 1] for full scroll range
  springConfig?: {
    stiffness: number
    damping: number
    mass: number
  }
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" },
  },
  "scroll-sticky": {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
}

function ScrollBasedTransition({
  children,
  className = "",
  scrollOffset = ["start end", "end start"],
  stickyRange = [0, 1],
  springConfig = { stiffness: 100, damping: 30, mass: 1 },
  duration = 0.5,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  scrollOffset?: [string, string]
  stickyRange?: [number, number]
  springConfig?: { stiffness: number; damping: number; mass: number }
  duration?: number
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: scrollOffset as any,
  })

  const smoothProgress = useSpring(scrollYProgress, springConfig)
  const y = useTransform(smoothProgress, stickyRange, [0, -100])
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.9])

  const variants = transitionVariants["scroll-sticky"]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={variants.initial}
      animate={variants.animate}
      style={{
        y,
        opacity,
        scale,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export default function PageTransition({
  children,
  className = "",
  variant = "fade",
  duration = 0.5,
  delay = 0,
  customVariants,
  scrollOffset = ["start end", "end start"],
  stickyRange = [0, 1],
  springConfig = { stiffness: 100, damping: 30, mass: 1 },
}: PageTransitionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const variants =
    variant === "custom" && customVariants
      ? customVariants
      : transitionVariants[variant as keyof typeof transitionVariants]

  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  if (variant === "scroll-sticky") {
    return (
      <ScrollBasedTransition
        className={className}
        scrollOffset={scrollOffset}
        stickyRange={stickyRange}
        springConfig={springConfig}
        duration={duration}
        delay={delay}
      >
        {children}
      </ScrollBasedTransition>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function ComponentTransition({
  children,
  className = "",
  variant = "fade",
  duration = 0.3,
  delay = 0,
  customVariants,
}: Omit<PageTransitionProps, "scrollOffset" | "stickyRange" | "springConfig">) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const variants =
    variant === "custom" && customVariants
      ? customVariants
      : transitionVariants[variant as keyof typeof transitionVariants]

  if (!mounted) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={variants.initial}
      animate={variants.animate}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

function ScrollStickySectionClient({
  children,
  className = "",
  stickyHeight = "200vh",
  parallaxStrength = 0.5,
}: {
  children: ReactNode
  className?: string
  stickyHeight?: string
  parallaxStrength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800
  const y = useTransform(scrollYProgress, [0, 1], [0, -windowHeight * parallaxStrength])
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height: stickyHeight }}>
      <motion.div className="sticky top-0 h-screen flex items-center justify-center" style={{ y, opacity }}>
        {children}
      </motion.div>
    </div>
  )
}

export function ScrollStickySection({
  children,
  className = "",
  stickyHeight = "200vh",
  parallaxStrength = 0.5,
}: {
  children: ReactNode
  className?: string
  stickyHeight?: string
  parallaxStrength?: number
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`relative ${className}`} style={{ height: stickyHeight }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">{children}</div>
      </div>
    )
  }

  return (
    <ScrollStickySectionClient className={className} stickyHeight={stickyHeight} parallaxStrength={parallaxStrength}>
      {children}
    </ScrollStickySectionClient>
  )
}
