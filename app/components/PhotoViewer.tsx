'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi'

interface Photo {
  public_id: string
  secure_url: string
  effects?: {
    filter?: string
    brightness?: number
    contrast?: number
  }
}

interface Props {
  photo: Photo
  onClose: () => void
}

const PhotoViewer: React.FC<Props> = ({ photo, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFullscreen(!isFullscreen)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[99999] flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ 
          scale: 1,
          width: isFullscreen ? '100%' : 'auto',
          height: isFullscreen ? '100%' : 'auto'
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "tween", duration: 0.2 }}
        className={`relative rounded-lg overflow-hidden ${isFullscreen ? '' : 'max-w-[90vw] max-h-[90vh]'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`relative ${isFullscreen ? 'w-screen h-screen' : 'w-[80vw] h-[80vh]'}`}>
          <Image
            src={photo.secure_url}
            alt="Viewed photo"
            fill
            className="object-contain"
            sizes={isFullscreen ? "100vw" : "80vw"}
            priority
            loading="eager"
            quality={85}
            style={{
              filter: photo.effects?.filter || undefined,
              transform: `brightness(${photo.effects?.brightness || 100}%) contrast(${photo.effects?.contrast || 100}%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={toggleFullscreen}
            className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>
          <button
            onClick={onClose}
            className="text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Click anywhere to close hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/30 px-4 py-2 rounded-full">
          Click anywhere outside to close
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PhotoViewer
