'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Photo {
  public_id: string
  secure_url: string
}

export default function ChangingBackground() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

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
    if (photos.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [photos])

  if (isLoading || photos.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {photos.map((photo, index) => (
        <div
          key={photo.public_id}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? 0.15 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <Image
            src={photo.secure_url.replace('/upload/', '/upload/w_1920,h_1080,c_fill,g_auto,q_auto,f_auto/')}
            alt="Background"
            fill
            priority={index === currentIndex}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50/90 to-white/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm"></div>
    </div>
  )
}
