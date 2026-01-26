import { useEffect, useRef } from 'react'
import { type PeerStream } from './lib/peer-stream'

type EventHandlers = Record<string, (event: Event) => void>
function lowercaseFirstLetter(word: string) {
  return word.charAt(0).toLowerCase() + word.slice(1)
}
export const useVideoWithCustomEvent = (eventHandlers: EventHandlers) => {
  const videoRef = useRef<PeerStream>(null)
  useEffect(() => {
    const addEventListeners = () => {
      Object.entries(eventHandlers).forEach(
        ([eventHandlerName, eventHandler]) => {
          const eventName = lowercaseFirstLetter(
            eventHandlerName.replace(/^on/, '')
          )
          videoRef.current?.addEventListener(eventName, eventHandler)
        }
      )
    }

    const removeEventListeners = () => {
      Object.entries(eventHandlers).forEach(
        ([eventHandlerName, eventHandler]) => {
          const eventName = lowercaseFirstLetter(
            eventHandlerName.replace(/^on/, '')
          )
          videoRef.current?.removeEventListener(eventName, eventHandler)
        }
      )
    }

    addEventListeners()

    // Cleanup function
    return () => {
      removeEventListeners()
    }
  }, [eventHandlers])
  return videoRef
}
