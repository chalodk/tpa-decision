"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

interface Session {
  id: string
  password: string
  startTime: string
  endTime?: string
  duration?: number
  sectionsVisited: string[]
  isActive: boolean
}

interface TrackingContextType {
  currentSession: Session | null
  startSession: (password: string) => void
  endSession: () => void
  trackSectionVisit: (section: string) => void
  getAllSessions: () => Session[]
  getSessionsByPassword: (password: string) => Session[]
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined)

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [lastActivity, setLastActivity] = useState<number>(Date.now())

  // Agregar verificación de localStorage
  const getAllSessions = useCallback((): Session[] => {
    try {
      if (typeof window === "undefined") return []
      const stored = localStorage.getItem("tpa-tracking-sessions")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading sessions:", error)
      return []
    }
  }, [])

  // Agregar manejo de errores en saveSessions
  const saveSessions = useCallback((sessions: Session[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("tpa-tracking-sessions", JSON.stringify(sessions))
      }
    } catch (error) {
      console.error("Error saving sessions:", error)
    }
  }, [])

  // Start a new session
  const startSession = useCallback(
    (password: string) => {
      // End any existing active session first without triggering re-render
      if (currentSession?.isActive) {
        const endTime = new Date().toISOString()
        const duration = Math.round(
          (new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / 60000,
        )

        const updatedSession: Session = {
          ...currentSession,
          endTime,
          duration,
          isActive: false,
        }

        // Update in localStorage directly
        const sessions = getAllSessions()
        const sessionIndex = sessions.findIndex((s) => s.id === currentSession.id)
        if (sessionIndex !== -1) {
          sessions[sessionIndex] = updatedSession
          saveSessions(sessions)
        }
      }

      const newSession: Session = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        password,
        startTime: new Date().toISOString(),
        sectionsVisited: ["hero"], // Always starts with hero
        isActive: true,
      }

      setCurrentSession(newSession)
      setLastActivity(Date.now())

      // Save to localStorage
      const sessions = getAllSessions()
      sessions.push(newSession)
      saveSessions(sessions)
    },
    [currentSession, getAllSessions, saveSessions],
  )

  // End current session
  const endSession = useCallback(() => {
    if (!currentSession?.isActive) return

    const endTime = new Date().toISOString()
    const duration = Math.round((new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / 60000) // minutes

    const updatedSession: Session = {
      ...currentSession,
      endTime,
      duration,
      isActive: false,
    }

    setCurrentSession(updatedSession)

    // Update in localStorage
    const sessions = getAllSessions()
    const sessionIndex = sessions.findIndex((s) => s.id === currentSession.id)
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = updatedSession
      saveSessions(sessions)
    }
  }, [currentSession, getAllSessions, saveSessions])

  // Track section visit
  const trackSectionVisit = useCallback(
    (section: string) => {
      if (!currentSession?.isActive) return

      const updatedSession = {
        ...currentSession,
        sectionsVisited: [...new Set([...currentSession.sectionsVisited, section])], // Avoid duplicates
      }

      setCurrentSession(updatedSession)
      setLastActivity(Date.now())

      // Update in localStorage
      const sessions = getAllSessions()
      const sessionIndex = sessions.findIndex((s) => s.id === currentSession.id)
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = updatedSession
        saveSessions(sessions)
      }
    },
    [currentSession, getAllSessions, saveSessions],
  )

  // Get sessions by password
  const getSessionsByPassword = useCallback(
    (password: string): Session[] => {
      return getAllSessions().filter((session) => session.password === password)
    },
    [getAllSessions],
  )

  // Stable activity handler
  const handleActivity = useCallback(() => {
    setLastActivity(Date.now())
  }, [])

  // Activity tracking
  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [handleActivity])

  // Inactivity timer (30 minutes)
  useEffect(() => {
    if (!currentSession?.isActive) return

    const checkInactivity = () => {
      const now = Date.now()
      const inactiveTime = now - lastActivity
      const thirtyMinutes = 30 * 60 * 1000

      if (inactiveTime > thirtyMinutes) {
        endSession()
      }
    }

    const interval = setInterval(checkInactivity, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [lastActivity, currentSession?.isActive, endSession])

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSession?.isActive) {
        endSession()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [currentSession?.isActive, endSession])

  return (
    <TrackingContext.Provider
      value={{
        currentSession,
        startSession,
        endSession,
        trackSectionVisit,
        getAllSessions,
        getSessionsByPassword,
      }}
    >
      {children}
    </TrackingContext.Provider>
  )
}

export function useTracking() {
  const context = useContext(TrackingContext)
  if (context === undefined) {
    throw new Error("useTracking must be used within a TrackingProvider")
  }
  return context
}
