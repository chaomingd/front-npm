import type { HTMLProps } from 'react'
import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback
} from 'react'
import { initialize } from './lib/peer-stream'
import { useVideoWithCustomEvent } from './useVideoWithCustomEvent'
import { useAutoLayoutContainer } from './useAutoLayoutContainer'
import './index.less'

initialize({})
type VideoProps = HTMLProps<HTMLVideoElement> & {
  signal: string
} & CommonProps
interface CommonProps {
  disablePictureInPicture?: boolean
  reconnectCount?: number
  poster?: string
}
type PixelPlayerProps = {
  disablePictureInPicture?: boolean
  onConnected?: () => void
  onDisconnected?: () => void
  onTryConnect?: () => void
  onClick?: () => void
  renderConnectingView?: () => JSX.Element
  renderDisconnectedView?: () => JSX.Element
  renderReconnectingView?: () => JSX.Element
  url: string
  className?: string
  positionOrigin?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
} & CommonProps

const defaultRenderTextView = (text: string) => {
  return (
    <div className="c-pixel-player__placeholder">
      <p className="c-pixel-player__placeholder-text">{text}</p>
    </div>
  )
}

export interface VideoHandler {
  play: () => void
  stop: () => void
  pause: () => void
  status: Status
}
type Status =
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'connecting'
  | 'disconnected'
  | 'reConnecting'
type EventHandlers = Record<string, (event: Event) => void>
export const PixelPlayer = forwardRef<VideoHandler, PixelPlayerProps>(
  (props: PixelPlayerProps, ref) => {
    const [status, setStatus] = useState<Status>('connecting')

    const {
      onConnected: externalOnConnected,
      onDisconnected: externalOnDisconnected,
      onTryConnect: externalOnTryConnect,
      onClick,
      renderConnectingView = () => {
        return defaultRenderTextView('正在连接中......')
      },
      renderReconnectingView = () => {
        return defaultRenderTextView('正在重连中......')
      },
      renderDisconnectedView = () => {
        return defaultRenderTextView('连接已断开')
      }
    } = props
    const onConnected = useCallback(() => {
      setStatus('playing')
      externalOnConnected?.()
    }, [externalOnConnected])
    const onDisconnected = useCallback(() => {
      setStatus('disconnected')
      externalOnDisconnected?.()
    }, [externalOnDisconnected])
    const onTryConnect = useCallback(() => {
      setStatus('reConnecting')
      externalOnTryConnect?.()
    }, [])
    const filteredEventHandlers = Object.fromEntries(
      Object.entries({
        onDisconnected,
        onConnected,
        onTryConnect,
        onClick
      }).filter(([_, value]) => value !== undefined)
    )
    const videoRef = useVideoWithCustomEvent(
      filteredEventHandlers as EventHandlers
    )
    const containerRef = useAutoLayoutContainer(
      videoRef,
      props.positionOrigin || 'top-left'
    )
    useImperativeHandle(ref, () => ({
      play: () => {
        // console.log('播放')
        videoRef.current?.customPlay()
        // 默认播放成功
        setStatus('playing')
      },
      pause: () => {
        // console.log('暂停')
        videoRef.current?.customPause()
        setStatus('paused')
      },
      stop: () => {
        // console.log('停止')
        videoRef.current?.customStop()
        setStatus('stopped')
      },
      status
      // 可以添加其他想要暴露的方法或属性
    }))
    const videoProps: VideoProps = {
      is: 'peer-stream',
      signal: props.url,
      reconnectCount: props.reconnectCount,
      poster: props.poster,
      disablePictureInPicture: true
    }
    return (
      <div
        className={['c-pixel-player__container', props.className].join(' ')}
        ref={containerRef}
      >
        {(() => {
          switch (status) {
            case 'connecting':
              return renderConnectingView()
            case 'disconnected':
              return renderDisconnectedView()
            case 'reConnecting':
              return renderReconnectingView()
            default:
              return null
          }
        })()}

        <video
          className="c-pixel-player__video"
          {...videoProps}
          ref={videoRef}
        />
      </div>
    )
  }
)
