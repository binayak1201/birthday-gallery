'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Photo {
  secure_url: string
}

interface BackgroundSlideshowProps {
  photos: Photo[]
}

const BackgroundSlideshow: React.FC<BackgroundSlideshowProps> = ({ photos }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    if (photos.length === 0) return

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [photos])

  if (photos.length === 0) return null

  return (
    <div className="fixed inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhotoIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center blur-md"
            style={{ 
              backgroundImage: `url(${photos[currentPhotoIndex].secure_url})`,
              filter: 'blur(10px)',
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default BackgroundSlideshow
