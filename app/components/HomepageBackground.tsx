'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const HomepageBackground: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-100/80 to-white/90 backdrop-blur-sm z-10" />
      
      {/* Background pattern of hearts */}
      <div className="absolute inset-0 bg-[url('/hearts-pattern.svg')] opacity-10 z-0" />
      
      {/* Main background image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl max-h-4xl">
          <Image
            src="/couple-cake.jpg"
            alt="Couple with birthday cake"
            fill
            className="object-contain"
            priority
            quality={90}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default HomepageBackground
