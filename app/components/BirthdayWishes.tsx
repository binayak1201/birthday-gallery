'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiSend, FiEdit2, FiTrash2, FiCheck, FiX, FiPlus, FiClock } from 'react-icons/fi'
import confetti from 'canvas-confetti'

interface Wish {
  _id: string
  name: string
  message: string
  createdAt: string
}

const triggerConfetti = () => {
  const end = Date.now() + 1000
  const colors = ['#ff69b4', '#ff1493', '#ff69b4']

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

export default function BirthdayWishes() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingWish, setEditingWish] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async () => {
    try {
      const response = await fetch('/api/wishes')
      if (!response.ok) {
        throw new Error('Failed to fetch wishes')
      }
      const data = await response.json()
      setWishes(data)
      setError(null)
    } catch (err) {
      setError('Failed to load wishes')
      console.error('Error fetching wishes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit wish')
      }

      await fetchWishes()
      setFormData({ name: '', message: '' })
      setOpen(false)
      toast.success('Birthday wish sent!')
      triggerConfetti()
    } catch (err) {
      toast.error('Failed to send wish')
      console.error('Error submitting wish:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (id: string) => {
    if (!editName || !editMessage) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`/api/wishes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName,
          message: editMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update wish')
      }

      await fetchWishes()
      setEditingWish(null)
      toast.success('Wish updated successfully!')
    } catch (err) {
      toast.error('Failed to update wish')
      console.error('Error updating wish:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wish?')) {
      return
    }

    try {
      const response = await fetch(`/api/wishes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete wish')
      }

      await fetchWishes()
      toast.success('Wish deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete wish')
      console.error('Error deleting wish:', err)
    }
  }

  const startEditing = (wish: Wish) => {
    setEditingWish(wish._id)
    setEditName(wish.name)
    setEditMessage(wish.message)
  }

  const cancelEditing = () => {
    setEditingWish(null)
    setEditName('')
    setEditMessage('')
  }

  return (
    <AnimatePresence>
      <div className="w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <h4 className="text-xl sm:text-2xl font-semibold text-pink-500 mb-2 sm:mb-0">Wishes</h4>
            <div className="flex items-center gap-2 text-pink-500">
              <FiClock size={isMobile ? 16 : 18} />
              <span className="text-xs sm:text-sm font-medium">24 days left</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-6">{error}</div>
          ) : wishes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="mb-4">No wishes yet. Be the first to send one!</p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200"
                  >
                    <FiHeart className="mr-2" /> Send a Wish
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl text-pink-500">
                      Send a Birthday Wish
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="min-h-32 border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FiSend className="mr-2" /> Send Wish
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <>
              <div className="grid gap-4 mb-6">
                {wishes.map((wish) => (
                  <motion.div
                    key={wish._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow p-3 sm:p-4"
                  >
                    {editingWish === wish._id ? (
                      <div className="space-y-3">
                        <Input
                          placeholder="Your Name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border-pink-200 focus:border-pink-400"
                        />
                        <Textarea
                          placeholder="Your Message"
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          className="min-h-20 sm:min-h-24 border-pink-200 focus:border-pink-400"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                            className="text-gray-500"
                          >
                            <FiX className="mr-1" /> Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEdit(wish._id)}
                            className="bg-pink-500 hover:bg-pink-600 text-white"
                          >
                            <FiCheck className="mr-1" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <div className="flex items-center gap-2 mb-1 sm:mb-0">
                            <div className="h-7 w-7 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                              <FiHeart size={14} />
                            </div>
                            <h5 className="font-semibold text-gray-800">
                              {wish.name}
                            </h5>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(wish.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3 text-sm sm:text-base">{wish.message}</p>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(wish)}
                            className="h-8 px-2 text-gray-500 hover:text-pink-500"
                          >
                            <FiEdit2 size={isMobile ? 14 : 16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(wish._id)}
                            className="h-8 px-2 text-gray-500 hover:text-red-500"
                          >
                            <FiTrash2 size={isMobile ? 14 : 16} />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200"
                  >
                    <FiPlus className="mr-2" /> Add New Wish
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-pink-500">
                      Send a Birthday Wish
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="min-h-32 border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FiSend className="mr-2" /> Send Wish
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
