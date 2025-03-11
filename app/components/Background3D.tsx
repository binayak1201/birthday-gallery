'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const AnimatedSpheres = () => {
  const group = useRef<THREE.Group>(null)
  const spheres = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    spheres.current.forEach((sphere, i) => {
      const offset = i * (Math.PI * 2) / 10
      sphere.position.x = Math.sin(time * 0.5 + offset) * 3
      sphere.position.y = Math.cos(time * 0.3 + offset) * 2
      sphere.position.z = Math.sin(time * 0.2 + offset) * 1
    })

    if (group.current) {
      group.current.rotation.y = time * 0.1
    }
  })

  return (
    <group ref={group}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) spheres.current[i] = el
          }}
          position={[
            Math.sin(i * (Math.PI * 2) / 10) * 3,
            Math.cos(i * (Math.PI * 2) / 10) * 2,
            0
          ]}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshPhongMaterial
            color={new THREE.Color(0.9, 0.2, 0.4)}
            emissive={new THREE.Color(0.5, 0.1, 0.2)}
            shininess={50}
          />
        </mesh>
      ))}
    </group>
  )
}

const Background3D: React.FC = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ff69b4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff1493" />
        <AnimatedSpheres />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  )
}

export default Background3D
