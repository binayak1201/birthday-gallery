'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Create dates in IST (UTC+5:30)
      const now = new Date()
      const targetDate = new Date(2025, 3, 4) // April 4th, 2025
      targetDate.setHours(23, 59, 59, 999)
      
      // Convert both to timestamps for comparison
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        // Calculate days
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        
        // Calculate hours
        const remainingAfterDays = difference % (1000 * 60 * 60 * 24)
        const hours = Math.floor(remainingAfterDays / (1000 * 60 * 60))
        
        // Calculate minutes
        const remainingAfterHours = remainingAfterDays % (1000 * 60 * 60)
        const minutes = Math.floor(remainingAfterHours / (1000 * 60))
        
        // Calculate seconds
        const remainingAfterMinutes = remainingAfterHours % (1000 * 60)
        const seconds = Math.floor(remainingAfterMinutes / 1000)

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isExpired: false
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const timerBoxVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  }

  if (timeLeft.isExpired) {
    return (
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-4xl font-bold text-pink-600">
          Happy Birthday! 🎉
        </h2>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex justify-center gap-6 text-3xl md:text-5xl font-bold">
        <motion.div 
          className="bg-pink-100 p-6 rounded-2xl shadow-lg transform"
          variants={timerBoxVariants}
          initial="initial"
          whileHover="hover"
        >
          <div className="text-pink-600 min-w-[3ch] tabular-nums">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-sm text-pink-400 mt-2">Days</div>
        </motion.div>
        <motion.div 
          className="bg-pink-100 p-6 rounded-2xl shadow-lg transform"
          variants={timerBoxVariants}
          initial="initial"
          whileHover="hover"
        >
          <div className="text-pink-600 min-w-[3ch] tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-sm text-pink-400 mt-2">Hours</div>
        </motion.div>
        <motion.div 
          className="bg-pink-100 p-6 rounded-2xl shadow-lg transform"
          variants={timerBoxVariants}
          initial="initial"
          whileHover="hover"
        >
          <div className="text-pink-600 min-w-[3ch] tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-sm text-pink-400 mt-2">Minutes</div>
        </motion.div>
        <motion.div 
          className="bg-pink-100 p-6 rounded-2xl shadow-lg transform"
          variants={timerBoxVariants}
          initial="initial"
          whileHover="hover"
        >
          <div className="text-pink-600 min-w-[3ch] tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-sm text-pink-400 mt-2">Seconds</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default CountdownTimer
