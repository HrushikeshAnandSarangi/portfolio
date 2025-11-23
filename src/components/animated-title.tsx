"use client"
import { useAnimation, motion } from "framer-motion"
import { useEffect, useRef } from "react"

interface AnimatedTitleProps {
  name: string
  tagline: string
}

export const AnimatedTitle = ({ name, tagline }: AnimatedTitleProps) => {
  const nameControls = useAnimation()
  const taglineControls = useAnimation()
  const coverControls = useAnimation()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sequence = async () => {
              await coverControls.start({
                scaleX: 0,
                transition: {
                  duration: 1.2,
                  ease: [0.42, 0, 0.58, 1],
                  delay: 0.2,
                },
                transformOrigin: "right",
              })

              await taglineControls.start({
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.1,
                },
              })
            }
            sequence()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    if (overlayRef.current) {
      observer.observe(overlayRef.current)
    }

    return () => {
      if (overlayRef.current) {
        observer.unobserve(overlayRef.current)
      }
    }
  }, [coverControls, taglineControls])

  const nameVariants = {
    initial: {
      opacity: 1,
      y: 0,
    },
  }

  const taglineVariants = {
    initial: {
      opacity: 0,
      y: 40,
      filter: "blur(3px)",
    },
  }

  return (
    <div
      ref={overlayRef}
      className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pointer-events-none px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center pointer-events-auto">
        <div className="relative inline-block w-full">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black flex justify-center overflow-hidden text-balance leading-tight whitespace-nowrap min-w-fit"
            variants={nameVariants}
            initial="initial"
            animate={nameControls}
            style={{ perspective: "800px" }}
          >
            {name}
          </motion.h1>
          <motion.div
            className="absolute top-0 right-0 w-full h-full bg-black"
            initial={{ scaleX: 1 }}
            animate={coverControls}
            style={{ transformOrigin: "right" }}
          />
        </div>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black mt-4 sm:mt-6 lg:mt-8 tracking-wide text-pretty max-w-2xl mx-auto"
          variants={taglineVariants}
          initial="initial"
          animate={taglineControls}
          style={{ transformOrigin: "center" }}
        >
          {tagline}
        </motion.p>
      </div>
    </div>
  )
}
