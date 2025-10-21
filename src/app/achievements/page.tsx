'use client'
import{useState,useRef,useEffect}from 'react'
import { AchievementCard } from "@/components/AchievementCard"
import TopographicBackground from "@/components/TopographicBackground"


const useThrottledMouse = (delay = 16) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const lastUpdate = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastUpdate.current >= delay) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        })
        lastUpdate.current = now
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [delay])

  return mousePosition
}
const hackathons = [
  {
    title: "Leukemia Detector",
    event: "Medhamanthan",
    year: "2025",
    placement: "3rd",
    description:
      "Built a mobile compact device which will analyse blood smeared images and detect Acute Lymphoblastic Leukemia",
    tags: ["IoT", "GAN Model",  "Edge"],
  },
  {
    title: "MetaFin",
    event: "Hackfest IIT Dhanbad 2025",
    year: "2025",
    placement: "3rd",
    description:
      "Created a Jargon free financial assitant.",
    tags: ["AI", "LLM", "Next.js"],
  },
  {
    title: "Vigrah",
    event: "E-Toycathon 2025",
    year: "2025",
    placement: "Finalist",
    description: "Built a Bipedal Bot which can be controlled through an mobile application with teaching abilities for childrens.",
    tags: ["Robotics", "Mobile Development", "LLm"],
  },
]

// const certifications = [
//   {
//     title: "Google Professional Cloud Architect",
//     issuer: "Google Cloud",
//     year: "2024",
//     description:
//       "Validated expertise in designing, developing, and managing robust, secure, scalable cloud architectures.",
//     tags: ["GCP", "Architecture", "Security"],
//     href: "#",
//   },
//   {
//     title: "AWS Solutions Architect – Associate",
//     issuer: "Amazon Web Services",
//     year: "2023",
//     description: "Proficiency in designing distributed systems with cost-optimized, fault-tolerant patterns.",
//     tags: ["AWS", "Distributed Systems"],
//     href: "#",
//   },
//   {
//     title: "Kubernetes and Cloud Native Associate (KCNA)",
//     issuer: "CNCF",
//     year: "2023",
//     description: "Foundational understanding of Kubernetes, containers, and cloud native principles.",
//     tags: ["Kubernetes", "CNCF"],
//     href: "#",
//   },
// ]

export default function AchievementsPage() {
  const mousePosition = useThrottledMouse(32)
  return (
    <main className="min-h-screen">
      <TopographicBackground mousePosition={mousePosition}/>
      {/* spacer for fixed navbar */}
      <div className="h-16 sm:h-18 lg:h-20" />

      <section className="max-w-6xl mx-auto px-5 py-8 sm:py-10 lg:py-12">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-[-0.01em]">Achievements</h1>
        </header>

        <div className="space-y-10 sm:space-y-12 lg:space-y-14">
          {/* Hackathons */}
          <section aria-labelledby="hackathons-heading">
            <div className="flex items-baseline justify-between mb-4">
              <h2 id="hackathons-heading" className="text-xl sm:text-2xl lg:text-3xl font-black uppercase">
                Hackathons
              </h2>
              <div className="h-[2px] flex-1 mx-4 bg-black/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {hackathons.map((h) => (
                <AchievementCard key={`${h.title}-${h.event}`} {...h} />
              ))}
            </div>
          </section>

          {/* Certifications */}
          {/* <section aria-labelledby="certifications-heading">
            <div className="flex items-baseline justify-between mb-4">
              <h2 id="certifications-heading" className="text-xl sm:text-2xl lg:text-3xl font-black uppercase">
                Certifications
              </h2>
              <div className="h-[2px] flex-1 mx-4 bg-black/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {certifications.map((c) => (
                <AchievementCard key={`${c.title}-${c.issuer}`} {...c} />
              ))}
            </div>
          </section> */}
        </div>
      </section>
    </main>
  )
}
