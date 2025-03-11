'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook that returns whether a media query matches
 * @param query The media query to check
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Define callback for media query change
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add event listener
    media.addEventListener('change', listener)

    // Clean up
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}
