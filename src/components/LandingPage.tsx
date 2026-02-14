"use client"
import { useState, useEffect, useRef, Suspense, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { motion, useAnimation } from "framer-motion"
import * as THREE from "three"
import type { ShaderMaterial } from "three"
import { ChevronDown, Mouse } from "lucide-react"
import Link from "next/link"
import { Pacifico } from 'next/font/google'

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
})

// Main Component
const App = () => {
  return (
    <div className="relative w-full min-h-screen bg-white text-black overflow-x-hidden font-sans">
      {/* Hero Section */}
      <motion.div className="relative w-full h-screen overflow-hidden">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-8 h-8 border-2 border-black border-t-white rounded-full"
              />
            </div>
          }
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <FlowingTopographicAnimation />
          </Canvas>
        </Suspense>
        <Overlay />
        <ScrollIndicator />
      </motion.div>
    </div>
  )
}

const FlowingTopographicAnimation = () => {
  const { viewport } = useThree()
  const materialRef = useRef<ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  )

  useFrame((state) => {
    const { clock, size } = state
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime()
      materialRef.current.uniforms.u_resolution.value.set(size.width * viewport.dpr, size.height * viewport.dpr)
    }
  })

  const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `

  const fragmentShader = `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.yw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        float wave(vec2 p, float freq, float amp, float speed, vec2 direction) {
            return amp * sin(dot(p, direction) * freq + u_time * speed);
        }

        // Fractal Brownian Motion enhanced for wave-like patterns
        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 1.0;
            
            for(int i = 0; i < 5; i++) {
                value += amplitude * snoise(p * frequency);
                amplitude *= 0.5;
                frequency *= 2.0;
            }
            return value;
        }

        void main() {
            vec2 scaledUv = vUv * 2.0 - 1.0;
            float aspectRatio = u_resolution.x / u_resolution.y;
            scaledUv.x *= aspectRatio;
            
            float time1 = u_time * 0.03;
            float time2 = u_time * 0.02;
            
            float wave1 = wave(scaledUv, 1.0, 0.4, 0.3, vec2(1.0, 0.2));
            float wave2 = wave(scaledUv, 1.5, 0.3, 0.2, vec2(0.8, 0.6));
            
            float oceanWave1 = wave(scaledUv * 0.4, 0.6, 0.6, 0.15, vec2(1.0, 0.1));
            float oceanWave2 = wave(scaledUv * 0.3, 0.8, 0.4, 0.2, vec2(0.9, 0.3));
            
            vec2 flow1 = scaledUv * 0.6 + vec2(time1, time2 * 0.8);
            float noise1 = fbm(flow1 + vec2(wave1, wave2) * 0.6);
            
            vec2 flow2 = scaledUv * 0.8 + vec2(time2 * 0.8, time1 * 0.6);
            float noise2 = fbm(flow2 + vec2(oceanWave1, oceanWave2) * 0.4) * 0.5;
            
            float combinedPattern = (wave1 + wave2 + oceanWave1 + oceanWave2) * 0.8 + noise1 + noise2;
            
            float baseDensity = 2.5;
            float waveDensity = baseDensity + (wave1 + wave2) * 3.0;
            
            float lineDensity1 = waveDensity;
            float lineDensity2 = waveDensity * 1.2;
            
            float line1 = fract(combinedPattern * lineDensity1);
            float line2 = fract(combinedPattern * lineDensity2);
            
            float waveIntensity = abs(wave1 + wave2 + oceanWave1) * 0.3;
            float thickness1 = 0.03 + waveIntensity * 0.02;
            float thickness2 = 0.02 + waveIntensity * 0.015;
            
            line1 = smoothstep(0.5 - thickness1, 0.5, line1) - smoothstep(0.5, 0.5 + thickness1, line1);
            line2 = smoothstep(0.5 - thickness2, 0.5, line2) - smoothstep(0.5, 0.5 + thickness2, line2);
            
            float finalLine = line1 * (0.8 + waveIntensity * 0.3) + 
                             line2 * (0.5 + waveIntensity * 0.2);
            
            vec3 color1 = vec3(0.0, 0.0, 0.0);
            vec3 color2 = vec3(0.05, 0.05, 0.05);
            vec3 color3 = vec3(0.1, 0.1, 0.1);
            vec3 color4 = vec3(0.15, 0.15, 0.15);
            
            vec3 lineColor = mix(color1, color2, smoothstep(-0.8, 0.2, combinedPattern));
            lineColor = mix(lineColor, color3, smoothstep(0.0, 0.6, combinedPattern));
            lineColor = mix(lineColor, color4, smoothstep(0.4, 0.8, waveIntensity));
            
            vec3 finalColor = lineColor * finalLine;
            
            float vignette = 1.0 - smoothstep(2.0, 3.5, length(scaledUv - vec2(0.0, 0.0)));
            vignette *= (1.0 + waveIntensity * 0.2);
            finalColor *= vignette;

            gl_FragColor = vec4(finalColor, finalLine * vignette);
        }
    `

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  )
}

const Overlay = () => {
  const controls = useAnimation()
  const leftControls = useAnimation()
  const rightControls = useAnimation()
  const nameControls = useAnimation()
  const taglineControls = useAnimation()
  const buttonsControls = useAnimation()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sequence = async () => {
              await controls.start("visible")

              await leftControls.start({
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.3, ease: "easeInOut" },
              })

              await rightControls.start({
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.3, ease: "easeInOut" },
              })

              await nameControls.start({
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.4, ease: "easeInOut", delay: 0.5 },
              })

              await taglineControls.start({
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: "easeInOut", delay: 0.5 },
              })

              await buttonsControls.start({
                opacity: 1,
                x: 0,
                transition: { duration: 0.3, ease: "easeInOut", delay: 0.5 },
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
  }, [controls, leftControls, rightControls, nameControls, taglineControls, buttonsControls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  const pillVariants = {
    hidden: { opacity: 0, y: 20 },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
  }

  const taglineVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(3px)" },
  }

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
  }

  const name = "Hrushikesh Anand Sarangi"
  const nameLetters = name.split("")

  const leftPills = [
    { text: "Clean Code", color: "bg-white border-black" },
    { text: "DevOps", color: "bg-white border-black" },
    { text: "Full Stack Dev", color: "bg-white border-black" },
    { text: "Fast & Responsive", color: "bg-white border-black" },
  ]

  const rightPills = [
    { text: "2+ Years", color: "bg-white border-black" },
    { text: "20+ Projects", color: "bg-white border-black" },
    { text: "10+ Technologies", color: "bg-white border-black" },
    { text: "100% Transparency", color: "bg-white border-black" },
  ]

  return (
    <motion.div
      ref={overlayRef}
      className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row justify-between items-center pointer-events-none px-4 sm:px-6 lg:px-8 gap-4 md:gap-0"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Left Pills */}
      <div className="flex flex-row md:flex-col flex-wrap gap-2 md:gap-4 pointer-events-auto justify-center md:justify-start">
        {leftPills.map((pill, i) => (
          <motion.div
            key={i}
            variants={pillVariants}
            initial="hidden"
            animate={leftControls}
            className={`px-4 py-2 rounded-full border-2 ${pill.color} text-black font-medium shadow-lg`}
          >
            {pill.text}
          </motion.div>
        ))}
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center text-center pointer-events-auto">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black flex justify-center text-balance leading-tight whitespace-nowrap"
          style={{ perspective: "800px" }}
        >
          {nameLetters.map((letter, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              initial="hidden"
              animate={nameControls}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className={`${pacifico.className} text-lg sm:text-xl md:text-2xl lg:text-3xl text-black mt-2 tracking-wide text-pretty max-w-xl mx-auto`}
          variants={taglineVariants}
          initial="hidden"
          animate={taglineControls}
        >
          Building Pragmatic Solutions
        </motion.p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/projects">
            <motion.button
              variants={buttonVariants}
              initial="hidden"
              animate={buttonsControls}
              className="px-6 py-3 bg-black text-white font-medium rounded-full shadow-md transition-all duration-300"
              whileHover={{
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.3)",
                y: -2,
              }}
              whileTap={{ y: 0 }}
            >
              EXPLORE PROJECTS →
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button
              variants={buttonVariants}
              initial="hidden"
              animate={buttonsControls}
              className="px-6 py-3 bg-white text-black font-medium rounded-full border-2 border-black shadow-md transition-all duration-300"
              whileHover={{
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.3)",
                y: -2,
              }}
              whileTap={{ y: 0 }}
            >
              ABOUT ME →
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Right Pills */}
      <div className="flex flex-row md:flex-col flex-wrap gap-2 md:gap-4 pointer-events-auto justify-center md:justify-start">
        {rightPills.map((pill, i) => (
          <motion.div
            key={i}
            variants={pillVariants}
            initial="hidden"
            animate={rightControls}
            className={`px-4 py-2 rounded-full border-2 ${pill.color} text-black font-medium shadow-lg`}
          >
            {pill.text}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
      }}
      transition={{ duration: 0.5, delay: 3 }}
    >
      <motion.div
        className="flex flex-col items-center text-black"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Mouse className="w-6 h-6 mb-2" />
        <span className="text-sm font-medium mb-3 hidden sm:block">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Animated scroll line */}
      <motion.div
        className="w-px bg-gradient-to-b from-black to-transparent mt-4"
        initial={{ height: 0 }}
        animate={{ height: 40 }}
        transition={{ duration: 1, delay: 3.5 }}
      />
    </motion.div>
  )
}

export default App