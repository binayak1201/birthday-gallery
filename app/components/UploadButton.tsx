'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { FiPlus, FiX, FiUpload } from 'react-icons/fi'

interface Props {
  onUploadComplete: () => void
}

const UploadButton: React.FC<Props> = ({ onUploadComplete }) => {
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      acceptedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      onUploadComplete()
      setShowModal(false)
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload photos. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: true
  })

  return (
    <>
      {/* Floating Upload Button */}
      <motion.button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiPlus size={24} />
      </motion.button>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Upload Photos</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-500'}`}
              >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto mb-4 text-4xl text-gray-400" />
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Drop the photos here...'
                    : 'Drag & drop photos here, or click to select'}
                </p>
              </div>

              {error && (
                <p className="mt-4 text-red-500 text-center">{error}</p>
              )}

              {uploading && (
                <p className="mt-4 text-pink-600 text-center">Uploading...</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default UploadButton
