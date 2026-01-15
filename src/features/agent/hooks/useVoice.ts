/**
 * useVoice Hook
 * Voice recording and playback for agent chat
 */

import { useState, useRef, useCallback, useEffect } from 'react'

const API_URL = import.meta.env.VITE_AGENT_API_URL || '/api/v1/agent'

export interface UseVoiceOptions {
  userId?: string
  onTranscript?: (text: string) => void
  onResponse?: (text: string, audio?: Blob) => void
  onError?: (error: string) => void
  autoPlay?: boolean
}

export interface UseVoiceReturn {
  isRecording: boolean
  isProcessing: boolean
  isPlaying: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<{ transcript: string; response: string; audio?: Blob } | null>
  cancelRecording: () => void
  playAudio: (audio: Blob) => void
  stopAudio: () => void
}

export function useVoice(options: UseVoiceOptions = {}): UseVoiceReturn {
  const {
    userId = 'default',
    onTranscript,
    onResponse,
    onError,
    autoPlay = true,
  } = options

  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        }
      })
      streamRef.current = stream

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start recording'
      onError?.(message)
    }
  }, [onError])

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !isRecording) {
      return null
    }

    return new Promise<{ transcript: string; response: string; audio?: Blob } | null>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }

        // Create blob from chunks
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []

        if (audioBlob.size === 0) {
          resolve(null)
          return
        }

        setIsProcessing(true)

        try {
          // Send to voice-chat API
          const formData = new FormData()
          formData.append('audio', audioBlob, 'recording.webm')

          const response = await fetch(`${API_URL}/${userId}/voice-chat?return_audio=true`, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }

          // Check content type
          const contentType = response.headers.get('content-type')
          
          if (contentType?.includes('audio')) {
            // Audio response with headers
            const audioResponse = await response.blob()
            const userText = response.headers.get('X-User-Text') || ''
            const agentText = response.headers.get('X-Agent-Text') || ''

            onTranscript?.(userText)
            onResponse?.(agentText, audioResponse)

            // Auto-play
            if (autoPlay && audioResponse.size > 0) {
              playAudioBlob(audioResponse)
            }

            resolve({
              transcript: userText,
              response: agentText,
              audio: audioResponse,
            })
          } else {
            // JSON response
            const data = await response.json()
            onTranscript?.(data.user_text)
            onResponse?.(data.agent_text)

            resolve({
              transcript: data.user_text,
              response: data.agent_text,
            })
          }

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Voice processing failed'
          onError?.(message)
          resolve(null)
        } finally {
          setIsProcessing(false)
        }
      }

      mediaRecorder.stop()
      setIsRecording(false)
    })
  }, [isRecording, userId, onTranscript, onResponse, onError, autoPlay])

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      chunksRef.current = []
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }, [isRecording])

  const playAudioBlob = useCallback(async (blob: Blob) => {
    try {
      // Create AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      const audioContext = audioContextRef.current

      // Decode audio
      const arrayBuffer = await blob.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      // Stop previous playback
      if (audioSourceRef.current) {
        audioSourceRef.current.stop()
      }

      // Create source and play
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      
      source.onended = () => {
        setIsPlaying(false)
      }

      source.start()
      audioSourceRef.current = source
      setIsPlaying(true)

    } catch (error) {
      console.error('Audio playback failed:', error)
      setIsPlaying(false)
    }
  }, [])

  const playAudio = useCallback((audio: Blob) => {
    playAudioBlob(audio)
  }, [playAudioBlob])

  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop()
      audioSourceRef.current = null
      setIsPlaying(false)
    }
  }, [])

  return {
    isRecording,
    isProcessing,
    isPlaying,
    startRecording,
    stopRecording,
    cancelRecording,
    playAudio,
    stopAudio,
  }
}

export default useVoice
