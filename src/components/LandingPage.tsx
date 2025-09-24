"use client"
import { useState, useEffect, useRef, Suspense, useMemo, useCallback, memo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { motion, useAnimation } from "framer-motion"
import * as THREE from "three"
import type { ShaderMaterial } from "three"
import { ChevronDown, Mouse } from "lucide-react"

const usePerformanceMonitor = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    const checkPerformance = () => {
      frameCount.current++
      const now = performance.now()

      if (frameCount.current % 60 === 0) {
        const fps = 60000 / (now - lastTime.current)
        setIsLowPerformance(fps < 30)
        lastTime.current = now
      }
    }

    const interval = setInterval(checkPerformance, 16)
    return () => clearInterval(interval)
  }, [])

  return isLowPerformance
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

const useThrottledMouse = (delay = 16) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const lastUpdate = useRef(0)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastUpdate.current >= delay) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        })
        lastUpdate.current = now
      }
    },
    [delay],
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return mousePosition
}

// Main Component
const App = () => {
  const mousePosition = useThrottledMouse(32) // Throttled mouse updates for better performance
  const isLowPerformance = usePerformanceMonitor()
  const isMobile = useIsMobile()

  return (
    <div className="relative w-full min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden font-sans">
      {/* Hero Section */}
      <motion.div className="relative w-full h-screen overflow-hidden">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-8 h-8 border-2 border-gray-400 border-t-gray-800 rounded-full"
              />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)} // Limited DPR for better mobile performance
          >
            <FlowingTopographicAnimation
              mousePosition={mousePosition}
              isLowPerformance={isLowPerformance}
              isMobile={isMobile}
            />
          </Canvas>
        </Suspense>
        <Overlay />
        <ScrollIndicator />

        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(-mousePosition.y + 1) * 50}%, rgba(0,0,0,0.1) 0%, transparent 50%)`,
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </div>
  )
}

const FlowingTopographicAnimation = memo(
  ({
    mousePosition,
    isLowPerformance,
    isMobile,
  }: {
    mousePosition: { x: number; y: number }
    isLowPerformance: boolean
    isMobile: boolean
  }) => {
    const { viewport } = useThree()
    const materialRef = useRef<ShaderMaterial>(null)

    const uniforms = useMemo(
      () => ({
        u_time: { value: 0.0 },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_resolution: { value: new THREE.Vector2(0, 0) },
        u_quality: { value: isMobile || isLowPerformance ? 0.5 : 1.0 }, // Quality scaling for performance
      }),
      [isMobile, isLowPerformance],
    )

    useFrame((state) => {
      const { clock, size } = state
      if (materialRef.current) {
        materialRef.current.uniforms.u_time.value = clock.getElapsedTime()
        const lerpSpeed = isMobile ? 0.003 : 0.005
        materialRef.current.uniforms.u_mouse.value.lerp(new THREE.Vector2(mousePosition.x, mousePosition.y), lerpSpeed)
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
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_quality;
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
            
            int iterations = u_quality > 0.7 ? 5 : 3; // Adaptive iterations based on quality
            for(int i = 0; i < 5; i++) {
                if(i >= iterations) break;
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
            
            float time1 = u_time * 0.02;
            float time2 = u_time * 0.015;
            
            vec2 mouseInfluence = u_mouse * 0.3;
            
            float wave1 = wave(scaledUv + mouseInfluence, 1.0, 0.4, 0.3, vec2(1.0, 0.2));
            float wave2 = wave(scaledUv + mouseInfluence * 0.8, 1.5, 0.3, 0.2, vec2(0.8, 0.6));
            
            float oceanWave1 = wave(scaledUv * 0.4 + mouseInfluence, 0.6, 0.6, 0.15, vec2(1.0, 0.1));
            float oceanWave2 = wave(scaledUv * 0.3 + mouseInfluence * 0.4, 0.8, 0.4, 0.2, vec2(0.9, 0.3));
            
            vec2 flow1 = scaledUv * 0.6 + vec2(time1, time2 * 0.8) + mouseInfluence * 0.5;
            float noise1 = fbm(flow1 + vec2(wave1, wave2) * 0.6);
            
            vec2 flow2 = scaledUv * 0.8 + vec2(time2 * 0.8, time1 * 0.6) + mouseInfluence * 0.3;
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
            
            vec3 color1 = vec3(0.12, 0.12, 0.12);
            vec3 color2 = vec3(0.3, 0.3, 0.3);
            vec3 color3 = vec3(0.5, 0.5, 0.5);
            vec3 color4 = vec3(0.7, 0.7, 0.7);
            
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
  },
)

FlowingTopographicAnimation.displayName = "FlowingTopographicAnimation"

const Overlay = () => {
  const nameControls = useAnimation()
  const taglineControls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      await nameControls.start({
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.2,
        },
      })

      await taglineControls.start({
        opacity: 1,
        y: 0,
        scaleX: 1,
        skewX: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.1,
        },
      })
    }
    sequence()
  }, [nameControls, taglineControls])

  const nameVariants = {
    initial: {
      opacity: 0,
      y: 60,
      rotateX: 30,
      scale: 0.9,
      filter: "blur(4px)",
    },
  }

  const taglineVariants = {
    initial: {
      opacity: 0,
      y: 40,
      scaleX: 0.8,
      skewX: -8,
      filter: "blur(3px)",
    },
  }

  const name = "Hrushikesh Anand Sarangi"

  return (
    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pointer-events-none px-4 sm:px-6 lg:px-8">
      <motion.div className="text-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-gray-800 flex flex-wrap justify-center overflow-hidden text-balance leading-tight"
          variants={nameVariants}
          initial="initial"
          animate={nameControls}
          style={{ perspective: "800px" }}
        >
          {name.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              className="inline-block"
              style={{
                padding: "0 1px",
                transformOrigin: "center bottom",
                transformStyle: "preserve-3d",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 mt-4 sm:mt-6 lg:mt-8 tracking-wide text-pretty max-w-2xl mx-auto"
          variants={taglineVariants}
          initial="initial"
          animate={taglineControls}
          style={{ transformOrigin: "center" }}
        >
          I build to scale
        </motion.p>
      </motion.div>
    </div>
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
        className="flex flex-col items-center text-gray-600"
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
        className="w-px bg-gradient-to-b from-gray-400 to-transparent mt-4"
        initial={{ height: 0 }}
        animate={{ height: 40 }}
        transition={{ duration: 1, delay: 3.5 }}
      />
    </motion.div>
  )
}

export default App
