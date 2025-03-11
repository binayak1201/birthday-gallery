'use client'

import React, { useState, useEffect } from 'react'
import CircularGallery from './components/CircularGallery'
import BirthdayWishes from './components/BirthdayWishes'
import { Button } from './components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'
import { FiUpload, FiHeart, FiClock } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState("")
  
  useEffect(() => {
    const targetDate = new Date("2025-04-04T00:00:00+05:30") // Birthday date
    
    const updateTimer = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeLeft("It's your birthday! 🎉")
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <motion.div
      className="flex flex-col items-center gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-xl text-pink-600 font-medium">Coming Soon</div>
      <div className="flex items-center gap-6 text-4xl font-bold text-pink-600">
        <div className="flex flex-col items-center">
          <span>{timeLeft.split(' ')[0]}</span>
          <span className="text-sm font-normal">Days</span>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <span>{timeLeft.split(' ')[1]?.replace('h', '')}</span>
          <span className="text-sm font-normal">Hours</span>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <span>{timeLeft.split(' ')[2]?.replace('m', '')}</span>
          <span className="text-sm font-normal">Minutes</span>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <span>{timeLeft.split(' ')[3]?.replace('s', '')}</span>
          <span className="text-sm font-normal">Seconds</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [showGallery, setShowGallery] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const formData = new FormData()
    for (const file of e.target.files) {
      formData.append('files', file)
    }

    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload photos')
      }

      toast.success('Photos uploaded successfully!')
      setUploadOpen(false)
      window.location.reload() // Refresh to show new photos
    } catch (error) {
      console.error('Error uploading photos:', error)
      toast.error('Failed to upload photos')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12 px-4 sm:px-8 md:px-16 lg:px-24">
      <AnimatePresence mode="wait">
        {!showGallery ? (
          <motion.div
            key="landing"
            className="z-10 w-full max-w-5xl flex flex-col items-center gap-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex flex-col items-center">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-pink-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Happy Birthday! 🎂
              </motion.h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-pink-600 dark:text-pink-500 mt-2 mb-4">
                Shona
              </h2>
            </div>

            <CountdownTimer />

            <motion.div
              className="text-2xl text-pink-500 text-center mb-12"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Click below to see your memories ✨
            </motion.div>

            <motion.button
              onClick={() => setShowGallery(true)}
              className="px-8 py-4 bg-pink-500 text-white rounded-full text-xl font-semibold hover:bg-pink-600 transform hover:scale-105 transition-all shadow-lg flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHeart />
              View Memories
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            className="z-10 w-full max-w-5xl flex flex-col items-center gap-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {/* Gallery Section */}
            <section className="w-full mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-pink-500">
                  Photo Memories
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowGallery(false)}
                  className="text-pink-500 hover:text-pink-600"
                >
                  Back to Home
                </Button>
              </div>
              <CircularGallery />
            </section>

            {/* Wishes Section */}
            <section className="w-full mt-12 mb-16">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-pink-500">
                Birthday Wishes
              </h3>
              <BirthdayWishes />
            </section>

            {/* Footer */}
            <footer className="w-full text-center text-sm text-gray-500 dark:text-gray-400 mt-auto pt-8">
              <p>Made with ❤️ for your special day</p>
              <p className="mt-2">© {new Date().getFullYear()}</p>
            </footer>

            {/* Upload Photos Button */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="floating"
                  size="floating"
                  className="fixed bottom-6 right-6 shadow-lg"
                >
                  <FiUpload size={24} />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white p-6 rounded-lg max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-pink-500">
                    Upload Photos
                  </DialogTitle>
                </DialogHeader>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="mt-4 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-pink-50 file:text-pink-700
                    hover:file:bg-pink-100
                    cursor-pointer"
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
