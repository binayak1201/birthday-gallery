'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMusic, FiPause, FiPlay, FiVolume2, FiVolumeX } from 'react-icons/fi'

const songs = [
  {
    title: 'Happy Birthday Jazz',
    url: '/music/happy-birthday-jazz.mp3'
  },
  {
    title: 'Birthday Celebration',
    url: '/music/celebration.mp3'
  },
  {
    title: 'Sweet Memories',
    url: '/music/sweet-memories.mp3'
  }
]

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(0)
  const [showPlayer, setShowPlayer] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(songs[currentSong].url)
    audioRef.current.volume = volume
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextSong = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setCurrentSong((prev) => (prev + 1) % songs.length)
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <>
      <motion.button
        onClick={() => setShowPlayer(true)}
        className="fixed bottom-40 right-8 z-40 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-pink-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiMusic />
      </motion.button>

      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-40 right-24 z-40 bg-white rounded-lg shadow-xl p-4 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-pink-600">Now Playing</h3>
              <button
                onClick={() => setShowPlayer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="text-center mb-4">
              <div className="font-medium text-gray-800">
                {songs[currentSong].title}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.button
                onClick={togglePlay}
                className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-xl hover:bg-pink-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <FiPause /> : <FiPlay />}
              </motion.button>
              <motion.button
                onClick={nextSong}
                className="text-pink-500 hover:text-pink-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Next
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-500 hover:text-gray-700"
              >
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MusicPlayer
