/* eslint-disable @typescript-eslint/no-non-null-assertion -- assert it is not null */
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export const useAutoLayoutContainer = (
  videoRef: RefObject<HTMLVideoElement>,
  positionOrigin: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const positionStyles = {
      'top-left': { top: 0, left: 0 },
      'top-right': { top: 0, right: 0 },
      'bottom-left': { bottom: 0, left: 0 },
      'bottom-right': { bottom: 0, right: 0 }
    }
    // 暂不支持自适应
    const setup = () => {
      if (!containerRef.current) {
        requestAnimationFrame(setup)
        return
      }
      const clientWidth = containerRef.current.clientWidth
      const clientHeight = containerRef.current.clientHeight
      if (clientHeight === 0 && clientWidth === 0) {
        // 重新查询
        requestAnimationFrame(setup)
        return
      }
      const ratio = clientWidth / clientHeight

      const height = `${clientHeight}px`
      const width = `${clientWidth}px`
      const defaultRatio = 1920 / 1080
      if (ratio > defaultRatio) {
        videoRef.current!.style.width = width
      } else {
        videoRef.current!.style.height = height
      }
      videoRef.current!.style.position = 'absolute'
      Object.assign(videoRef.current!.style, positionStyles[positionOrigin])
    }
    setup()
  }, [])
  return containerRef
}
