'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent } from './ui/dialog'

interface Photo {
  public_id: string
  secure_url: string
}

export default function CircularGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isGridView, setIsGridView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos')
        if (!response.ok) {
          throw new Error('Failed to fetch photos')
        }
        const data = await response.json()
        setPhotos(data.resources)
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!photos.length || !containerRef.current || isGridView) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const container = containerRef.current
    const images = container.getElementsByClassName('gallery-image')
    const centerX = container.offsetWidth / 2
    const centerY = container.offsetHeight / 2
    
    // Adjust radius based on screen size
    const radiusRatio = isMobile ? 0.6 : 0.8
    const radius = Math.min(centerX, centerY) * radiusRatio
    
    const totalImages = images.length
    const rotationDuration = 15000 // 15 seconds per cycle
    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) % rotationDuration
      const currentAngle = (progress / rotationDuration) * 360
      
      for (let i = 0; i < images.length; i++) {
        const angle = (currentAngle + (i * 360) / totalImages) * (Math.PI / 180)
        const x = centerX + radius * Math.cos(angle) - images[i].clientWidth / 2
        const y = centerY + radius * Math.sin(angle) - images[i].clientHeight / 2
        
        // Adjust scale based on screen size
        const scaleAmount = isMobile ? 0.15 : 0.2
        const scale = 1 + scaleAmount * Math.sin(angle)
        const zIndex = Math.round(100 + 50 * Math.sin(angle))

        const image = images[i] as HTMLElement
        image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
        image.style.zIndex = zIndex.toString()
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [photos, isGridView, isMobile])

  const handlePhotoClick = (photo: Photo) => {
    setIsImageLoading(true)
    setSelectedPhoto(photo)
  }

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] md:h-[600px] flex items-center justify-center">
        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Calculate image size based on device
  const thumbnailSize = isMobile ? 80 : 120
  const gridImageSize = isMobile ? 150 : 300

  return (
    <>
      <div 
        className="relative w-full h-[50vh] md:h-[600px] overflow-hidden" 
        ref={containerRef}
      >
        {/* View Toggle Button */}
        <motion.button
          onClick={() => setIsGridView(!isGridView)}
          className="absolute top-4 right-4 z-[100] px-3 py-1.5 md:px-4 md:py-2 bg-pink-500/90 hover:bg-pink-600/90 text-white rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg flex items-center gap-1 md:gap-2 hover:scale-105 text-sm md:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isGridView ? "Switch to circular view" : "Switch to grid view"}
        >
          {isGridView ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
              <span className="hidden sm:inline">Circular View</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "16" : "20"} height={isMobile ? "16" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span className="hidden sm:inline">Grid View</span>
            </>
          )}
        </motion.button>

        {/* Photos Container */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={isGridView ? 'grid' : 'circle'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full h-full ${isGridView ? 'overflow-y-auto' : ''}`}
          >
            <div className={isGridView ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-6' : ''}>
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.public_id}
                  className={`gallery-image cursor-pointer ${isGridView ? '' : 'absolute'}`}
                  initial={isGridView ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0 }}
                  animate={isGridView ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  onClick={() => handlePhotoClick(photo)}
                >
                  <Image
                    src={photo.secure_url.replace('/upload/', isGridView 
                      ? `/upload/w_${gridImageSize},h_${gridImageSize},c_fill,g_face/` 
                      : `/upload/w_${thumbnailSize},h_${thumbnailSize},c_fill,g_face/`)}
                    alt="Gallery photo"
                    width={isGridView ? gridImageSize : thumbnailSize}
                    height={isGridView ? gridImageSize : thumbnailSize}
                    className={`rounded-lg shadow-lg transition-all duration-300 ${
                      isGridView 
                        ? 'w-full h-auto aspect-square object-cover hover:scale-105 hover:shadow-xl' 
                        : 'hover:shadow-2xl'
                    }`}
                    priority={index < 8}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Full-Screen Image Viewer - Mobile Responsive */}
      <AnimatePresence>
        {selectedPhoto && (
          <div 
            className="fixed inset-0 bg-black/95 z-[999999] flex items-center justify-center touch-none"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                  </div>
                )}
                <Image
                  src={selectedPhoto.secure_url.replace('/upload/', '/upload/q_auto,f_auto/')}
                  alt="Selected photo"
                  width={isMobile ? 800 : 1200}
                  height={isMobile ? 600 : 800}
                  className="rounded-lg max-h-[90vh] max-w-[95vw] md:max-h-[85vh] md:max-w-[85vw] object-contain"
                  priority
                  onLoadingComplete={() => setIsImageLoading(false)}
                  loading="eager"
                  unoptimized={false}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(null);
                  }}
                  className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-white/90 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors shadow-lg"
                  aria-label="Close fullscreen view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
