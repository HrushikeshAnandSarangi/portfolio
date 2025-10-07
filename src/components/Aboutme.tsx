"use client"

import { useEffect, useMemo, useRef, useState } from "react"

// A more generic type for different kinds of timeline events
type TimelineItem = {
  title: string
  organization: string
  period: string
  description: string
  highlights?: string[]
}

// Data has been refined for a more professional and impactful narrative
const whoIAmItems: TimelineItem[] = [
    {
        title: "Foundations in Engineering & Design",
        organization: "National Institute of Technology, Rourkela",
        period: "2021 – Present",
        description: "My academic journey began at the intersection of design and technology. Pursuing Industrial Design gave me a unique perspective on product development, while my deep dive into computer science fundamentals provided the engineering rigor to build robust, scalable applications.",
        highlights: [
            "Core Specializations: Distributed Systems, Data Structures & Algorithms, and Cloud Computing.",
        ]
    },
    {
        title: "Global Platform for IEEE INDISCON",
        organization: "Web Developer",
        period: "September 2023 – Present",
        description: "I led the development of the official web platform for an international IEEE conference, creating a seamless digital experience for over 500 global participants. This high-stakes project honed my skills in building secure, reliable, and user-centric applications from the ground up.",
        highlights: [
            "Engineered a full-stack solution with secure registration and multi-track event scheduling.",
            "Delivered a highly responsive and accessible platform for a diverse, international audience."
        ]
    },
    {
        title: "AI for Social Good: A HealthTech Initiative",
        organization: "Medhamanthan Project",
        period: "June 2025 – July 2025",
        description: "To apply technology for social impact, I engineered a cost-effective, AI-powered leukemia detection system optimized for edge computing on a Raspberry Pi. This project, which secured 3rd place at IEEE Medhamanthan 2025, demonstrated my ability to deliver performant ML solutions under significant hardware constraints.",
        highlights: [
            "Developed a lightweight CNN achieving real-time inference in under one second.",
            "Containerized the system with Docker for secure, scalable deployment."
        ]
    },
    {
        title: "AI-Driven Finance: The MetaFin Platform",
        organization: "Personal Project",
        period: "March 2025 – April 2025",
        description: "Exploring the frontier of generative AI, I built a multi-agent financial analytics platform leveraging the Gemini LLM. This tool transforms complex market data into personalized, actionable insights, showcasing my expertise in deploying sophisticated, AI-driven applications with a focus on end-to-end system design.",
        highlights: [
            "Achieved over 85% recommendation accuracy in test portfolios.",
            "Deployed a resilient, scalable architecture using Docker and Kubernetes, ensuring 99% uptime."
        ]
    },
    {
        title: "Leadership in Technology",
        organization: "Web Development Head, AICHE NIT Rourkela",
        period: "June 2025 – Present",
        description: "I believe in empowering my community through technology. As the Web Development Head for my university's AICHE chapter, I lead a team in enhancing our digital presence. This role is focused on mentorship, collaboration, and applying technical expertise to achieve organizational goals.",
        highlights: [
            "Spearheaded optimizations that improved website load performance by 25%."
        ]
    }
]

const technologies = [
    { name: "Python", category: "Languages" },
    { name: "TypeScript", category: "Languages" },
    { name: "Java", category: "Languages" },
    { name: "C++", category: "Languages" },
    { name: "Bash", category: "Languages" },
    { name: "React/Next.js", category: "Frameworks" },
    { name: "FastAPI", category: "Frameworks" },
    { name: "Spring Boot", category: "Frameworks" },
    { name: "Django", category: "Frameworks" },
    { name: "Tailwind CSS", category: "Frameworks" },
    { name: "Electron.js", category: "Frameworks" },
    { name: "Docker", category: "DevOps & Tools" },
    { name: "Kubernetes", category: "DevOps & Tools" },
    { name: "Git", category: "DevOps & Tools" },
    { name: "Postman", category: "DevOps & Tools" },
    { name: "MySQL", category: "Databases" },
    { name: "Supabase", category: "Databases" },
];

const techCategories = ["All", ...Array.from(new Set(technologies.map(t => t.category)))];


export default function WhoIAmSection({
  inverted = false,
  activeSlug,
  onActiveChange,
}: {
  inverted?: boolean
  activeSlug?: string
  onActiveChange?: (slug: string) => void
}) {
  const title = "My Journey"
  const items = whoIAmItems;
  const [activeCategory, setActiveCategory] = useState("All");

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const slugs = useMemo(() => items.map((i) => slugify(i.title)), [items])

  const [visible, setVisible] = useState<boolean[]>(() => items.map(() => false))
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    setVisible(items.map(() => false))
    itemRefs.current = itemRefs.current.slice(0, items.length)

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex: number | null = null
        let bestRatio = 0

        entries.forEach((entry) => {
          const indexAttr = entry.target.getAttribute("data-index")
          if (!indexAttr) return
          const i = Number(indexAttr)

          if (entry.isIntersecting) {
            setVisible((prev) => {
              if (prev[i]) return prev
              const clone = [...prev]
              clone[i] = true
              return clone
            })
            if (entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio
              bestIndex = i
            }
          }
        })

        if (bestIndex != null && onActiveChange) {
          const slug = slugs[bestIndex]
          onActiveChange(slug)
        }
      },
      { threshold: [0.15, 0.5, 0.75] },
    )

    itemRefs.current.forEach((el) => {
        if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items, slugs, onActiveChange])

  const filteredTechnologies = technologies.filter(
    (tech) => activeCategory === "All" || tech.category === activeCategory
  );

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className={inverted ? "bg-black text-white" : "bg-white text-black"}
    >
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <header className="mb-16 text-center">
          <h2 id="journey-heading" className="text-pretty text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-pretty text-lg text-gray-600 dark:text-gray-400">
            I build high-performance, user-centric applications at the intersection of design and engineering. My journey is one of continuous learning, driven by a passion for solving complex problems with elegant, scalable solutions.
          </p>
        </header>

        <div className="relative pl-8">
          {/* Timeline spine */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[15px] top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-700" />

          <div className="flex flex-col gap-12">
            {items.map((item, idx) => {
              const slug = slugs[idx]
              const headingId = `${slug}-title`
              const isVisible = visible[idx]
              const isActive = activeSlug === slug

              return (
                <article
                  key={slug}
                  id={slug}
                  aria-labelledby={headingId}
                  aria-current={isActive ? "true" : undefined}
                  data-index={idx}
                  ref={(el) => { itemRefs.current[idx] = el }}
                  className={`group relative transition-all duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0 translate-y-3"
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-[-17px] top-1 flex items-center justify-center rounded-full bg-white dark:bg-black transition-all duration-300 ${
                      isActive ? "h-8 w-8" : "h-4 w-4"
                    }`}
                  >
                     <span className={`h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-500 transition-all duration-300 ${isActive ? 'bg-black dark:bg-white' : ''}`}></span>
                  </span>

                  <div className="relative rounded-lg border border-gray-200/80 bg-white p-6 transition-all duration-300 group-hover:shadow-md dark:border-gray-800/50 dark:bg-gray-900">
                    <header>
                      <h3 id={headingId} className="text-pretty text-lg font-semibold md:text-xl text-black dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-pretty text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-black/90 dark:text-white/90">{item.organization}</span> <span aria-hidden="true">•</span>{" "}
                        <span>{item.period}</span>
                      </p>
                    </header>

                    <div className="mt-4 space-y-4">
                      <p className="text-pretty leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.description}
                      </p>

                      {item.highlights && item.highlights.length > 0 ? (
                        <div>
                          <p className="font-semibold text-sm text-black dark:text-white">Key Highlights</p>
                          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                            {item.highlights.map((h, i) => (
                              <li key={i} className="leading-relaxed text-gray-700 dark:text-gray-300">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Technologies Section */}
        <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">My Toolkit</h3>
            <p className="mt-3 max-w-xl mx-auto text-gray-600 dark:text-gray-400">
                The tools and technologies I use to bring ideas to life.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800 sm:gap-4">
                {techCategories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                            activeCategory === category
                                ? "bg-white text-black shadow-sm dark:bg-black dark:text-white"
                                : "text-gray-600 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-black/50"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
             <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredTechnologies.map((tech) => (
                    <span 
                        key={tech.name} 
                        className="flex justify-center items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-inset ring-gray-200/50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-800/50"
                    >
                        {tech.name}
                    </span>
                ))}
            </div>
        </div>

        {/* Resume Download Section */}
        <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Interested in my work?</h3>
            <p className="mt-3 max-w-xl mx-auto text-gray-600 dark:text-gray-400">
                Let's connect. You can view my full resume for a more detailed look at my experience.
            </p>
            <div className="mt-8">
                 {/* Make sure to place your resume PDF in the `public` folder of your project */}
                <a 
                    href="/Hrushikesh_FullStack.pdf" 
                    download="Hrushikesh_Sarangi_Resume.pdf"
                    className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 transition-all duration-300 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus-visible:outline-black"
                >
                    Download My Resume
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-2 h-5 w-5">
                        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                    </svg>
                </a>
            </div>
        </div>
      </div>
    </section>
  )
}

