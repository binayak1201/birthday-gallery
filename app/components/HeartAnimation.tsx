'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const HeartAnimation: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
      }
      setHearts(prev => [...prev, newHeart])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (hearts.length > 10) {
      const timeout = setTimeout(() => {
        setHearts(prev => prev.slice(1))
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [hearts])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ y: window.innerHeight, x: heart.x, scale: 0 }}
          animate={{
            y: -100,
            scale: [1, 1.5, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: 6,
            ease: "linear",
            scale: {
              duration: 2,
              repeat: Infinity,
            },
            rotate: {
              duration: 2,
              repeat: Infinity,
            },
          }}
          className="absolute text-4xl text-pink-500"
        >
          ❤️
        </motion.div>
      ))}
    </div>
  )
}

export default HeartAnimation
