import React, { useEffect, useState } from 'react'
import { throttle } from 'throttle-debounce'

export const useIsInView = (
  ref: React.RefObject<HTMLElement>,
  offset: number
) => {
  const [isInView, setIsInView] = useState(false)

  const handleScroll = throttle(300, () => {
    const current = ref.current

    if (
      current &&
      current.getBoundingClientRect().top < window.innerHeight - offset
    ) {
      setIsInView(true)
      window.removeEventListener('scroll', handleScroll)
    }
  })

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isInView
}
