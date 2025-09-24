"use client"
import { useRef, useMemo, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import * as THREE from "three"
import TopographicBackground from "./TopographicBackground"

const SpinningGlobe = () => {
  const globeRef = useRef<THREE.Mesh>(null)
  const indiaMarkerRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // India coordinates (approximate)
  const indiaLat = 20.5937
  const indiaLng = 78.9629

  // Convert lat/lng to 3D coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    )
  }

  const indiaPosition = useMemo(() => latLngToVector3(indiaLat, indiaLng, 1.02), [])

  const worldMapTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    canvas.width = 512
    canvas.height = 256

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#1f2937"
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.8

    const continents = [
      [
        [50, 80]
      ]
    ]

    continents.forEach((continent) => {
      ctx.beginPath()
      ctx.moveTo(continent[0][0], continent[0][1])
      continent.forEach(([x, y]) => ctx.lineTo(x, y))
      ctx.closePath()
      ctx.stroke()
    })

    return new THREE.CanvasTexture(canvas)
  }, [])

  const globeGeometry = useMemo(() => new THREE.SphereGeometry(1, 64, 32), [])

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.008
    }
    if (indiaMarkerRef.current) {
      indiaMarkerRef.current.position.copy(indiaPosition)
      indiaMarkerRef.current.rotation.y += 0.008
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      indiaMarkerRef.current.scale.setScalar(scale)
    }
    if (ringRef.current) {
      ringRef.current.position.copy(indiaPosition)
      ringRef.current.rotation.y += 0.008
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity
    }
  })

  return (
    <group>
      <mesh ref={globeRef} geometry={globeGeometry}>
        <meshBasicMaterial map={worldMapTexture} transparent opacity={0.9} />
      </mesh>

      <mesh geometry={globeGeometry}>
        <meshBasicMaterial color="#374151" wireframe transparent opacity={0.3} />
      </mesh>

      <mesh ref={indiaMarkerRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>

      <mesh ref={ringRef}>
        <ringGeometry args={[0.05, 0.08, 16]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    const detectTheme = () => {
      setIsDarkMode(false)
    }

    detectTheme()
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const getGitHubStreakUrl = (username: string) => {
    const baseUrl = "https://github-readme-streak-stats.herokuapp.com/"
    const params = new URLSearchParams({
      user: username,
      theme: "light",
      hide_border: "true",
      background: "FFFFFF",
      stroke: "1F2937",
      ring: "DC2626",
      fire: "DC2626",
      currStreakNum: "1F2937",
      sideNums: "1F2937",
      currStreakLabel: "1F2937",
      sideLabels: "1F2937",
      dates: "6B7280",
    })
    return `${baseUrl}?${params.toString()}`
  }

  return (
    <div className="relative w-full min-h-screen bg-white text-gray-900 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Suspense fallback={null}>
        <TopographicBackground mousePosition={mousePosition} />
      </Suspense>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[80vh]">
          {/* Location Card - Large */}
          <motion.div
            className="lg:col-span-8 lg:row-span-2 backdrop-blur-xl bg-black/5 border border-gray-200 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, borderColor: "rgba(0,0,0,0.2)" }}
          >
            <div className="flex-1 text-center lg:text-left">
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                I'm based in
              </motion.h2>
              <motion.p
                className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 font-medium"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                India, Asia
              </motion.p>
            </div>

            <motion.div
              className="w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <SpinningGlobe />
              </Canvas>
            </motion.div>
          </motion.div>

          {/* About Me Card - Medium */}
          <motion.div
            className="lg:col-span-4 lg:row-span-1 backdrop-blur-xl bg-black/5 border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, borderColor: "rgba(0,0,0,0.2)" }}
          >
            <motion.h3
              className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              About Me
            </motion.h3>
            <motion.p
              className="text-gray-600 leading-relaxed text-sm lg:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Full-stack developer passionate about creating scalable applications with modern web technologies and
              cloud architecture.
            </motion.p>
          </motion.div>

          {/* Work Rhythm Card - Large */}
          <motion.div
            className="lg:col-span-4 lg:row-span-1 backdrop-blur-xl bg-black/5 border border-gray-200 rounded-3xl p-6 lg:p-8 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, borderColor: "rgba(0,0,0,0.2)" }}
          >
            <motion.h3
              className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Work Rhythm
            </motion.h3>
            <motion.div
              className="overflow-hidden rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <iframe
                src={getGitHubStreakUrl("HrushikeshAnandSarangi")}
                className="w-full h-48 border-0 rounded-xl"
                loading="lazy"
                title="GitHub Streak Stats"
              />
              <img
                src={getGitHubStreakUrl("HrushikeshAnandSarangi") || "/placeholder.svg"}
                alt="Work Rhythm Streak"
                className="w-full filter brightness-110 contrast-125 hidden"
                onError={(e) => {
                  e.currentTarget.style.display = "block"
                  e.currentTarget.previousElementSibling?.remove()
                }}
              />
            </motion.div>
            <motion.p
              className="text-gray-500 mt-4 text-xs lg:text-sm text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              Consistency drives excellence
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About
