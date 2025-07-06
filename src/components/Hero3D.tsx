import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

// Crypto coin component
const CryptoCoin = ({ position, color, symbol }: { position: [number, number, number], color: string, symbol: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <group position={position}>
        <Box ref={meshRef} args={[0.8, 0.8, 0.1]} castShadow receiveShadow>
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </Box>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {symbol}
        </Text>
      </group>
    </Float>
  )
}

// Particle system
const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3)
    const colors = new Float32Array(200 * 3)
    
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      colors[i * 3] = Math.random()
      colors[i * 3 + 1] = Math.random()
      colors[i * 3 + 2] = 1
    }
    
    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.01
        if (positions[i] > 10) positions[i] = -10
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  )
}

// Network connections
const NetworkLines = () => {
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const coinPositions = [
    [-4, 2, 0], [4, 1, -2], [-2, -1, 1], [3, -2, 0],
    [-1, 3, -1], [2, 0, 2], [-3, -3, -1], [1, 2, 1]
  ]

  const geometry = useMemo(() => {
    const points = []
    const colors = []
    
    for (let i = 0; i < coinPositions.length; i++) {
      for (let j = i + 1; j < coinPositions.length; j++) {
        const distance = new THREE.Vector3(...coinPositions[i]).distanceTo(new THREE.Vector3(...coinPositions[j]))
        if (distance < 4) {
          points.push(...coinPositions[i], ...coinPositions[j])
          colors.push(0.6, 0.4, 1, 0.6, 0.4, 1)
        }
      }
    }
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    return geo
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial vertexColors transparent />
    </lineSegments>
  )
}

// Main 3D scene
const Scene3D = () => {
  const cryptoCoins = [
    { position: [-4, 2, 0] as [number, number, number], color: '#f7931a', symbol: 'BTC' },
    { position: [4, 1, -2] as [number, number, number], color: '#627eea', symbol: 'ETH' },
    { position: [-2, -1, 1] as [number, number, number], color: '#0033ad', symbol: 'ADA' },
    { position: [3, -2, 0] as [number, number, number], color: '#e6007a', symbol: 'DOT' },
    { position: [-1, 3, -1] as [number, number, number], color: '#00d4aa', symbol: 'BNB' },
    { position: [2, 0, 2] as [number, number, number], color: '#1652f0', symbol: 'LINK' },
    { position: [-3, -3, -1] as [number, number, number], color: '#9f71ec', symbol: 'SOL' },
    { position: [1, 2, 1] as [number, number, number], color: '#ff6b35', symbol: 'AVAX' }
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9E7FFF" />
      
      {cryptoCoins.map((coin, index) => (
        <CryptoCoin key={index} {...coin} />
      ))}
      
      <Particles />
      <NetworkLines />
    </>
  )
}

const Hero3D = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene3D />
      </Canvas>
    </div>
  )
}

export default Hero3D