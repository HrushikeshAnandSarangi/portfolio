"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ExternalLink, Github, Play, Filter } from "lucide-react"
import { projects, categories, type Project } from "@/data/projects"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Dynamic grid sizing based on featured status and index
  const getGridClass = () => {
    if (project.featured) {
      return index % 3 === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
    }
    return "md:col-span-1 md:row-span-1"
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group ${getGridClass()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="relative h-full overflow-hidden border-0 bg-white/20 backdrop-blur-md shadow-2xl">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md" />

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Project Image */}
          <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100/50">
            <motion.img
              src={project.image}
              alt={project.name}
              className="w-full h-48 object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Project Info */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                {project.name}
              </h3>
              {project.featured && <Badge className="bg-gray-900/20 text-gray-900 border-gray-900/30">Featured</Badge>}
            </div>

            <p className="text-gray-700 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs bg-gray-900/10 text-gray-900 border-gray-900/20">
                  {tech}
                </Badge>
              ))}
              {project.techStack.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-900/10 text-gray-900 border-gray-900/20">
                  +{project.techStack.length - 3}
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              {project.demoLink && (
                <Button
                  size="sm"
                  className="bg-gray-900/20 hover:bg-gray-900/30 text-gray-900 border-gray-900/30"
                  asChild
                >
                  <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4 mr-1" />
                    Demo
                  </a>
                </Button>
              )}
              {project.deployedLink && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gray-900/10 hover:bg-gray-900/20 text-gray-900 border-gray-900/30"
                  asChild
                >
                  <a href={project.deployedLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Live
                  </a>
                </Button>
              )}
              {project.githubLink && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gray-900/10 hover:bg-gray-900/20 text-gray-900 border-gray-900/30"
                  asChild
                >
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </Card>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const mousePosition = useThrottledMouse(32)

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <TopographicBackground mousePosition={mousePosition} />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in web development, AI, and modern technologies
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/30 border-gray-300/50 text-gray-900 placeholder:text-gray-600 backdrop-blur-md"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white/30 text-gray-900 border-gray-300/50 hover:bg-white/50"
                }
              >
                <Filter className="w-4 h-4 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <p className="text-xl text-gray-600">No projects found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="mt-4 bg-gray-900/20 hover:bg-gray-900/30 text-gray-900"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
