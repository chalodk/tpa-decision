"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface VideoDemo {
  id: string
  title: string
  youtubeUrl: string
  description?: string
  createdAt: string
}

const extractVideoId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  return match ? match[1] : null
}

export default function DemosSection() {
  const [videoDemos, setVideoDemos] = useState<VideoDemo[]>([])

  useEffect(() => {
    const defaultVideoDemos = [
      {
        id: "1",
        title: "Fundamentos de IA Generativa",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Introducción completa a los conceptos básicos y aplicaciones prácticas",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Técnicas Avanzadas de Prompting",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Metodologías para crear prompts efectivos y obtener mejores resultados",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Aplicaciones Empresariales",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Casos de uso reales en diferentes sectores e industrias",
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        title: "Workshop: Automatización con IA",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        description: "Sesión práctica de implementación de soluciones automatizadas",
        createdAt: new Date().toISOString(),
      },
    ]

    const loadVideoDemos = () => {
      const savedVideoDemos = localStorage.getItem("tpa-admin-video-demos")
      if (savedVideoDemos) {
        setVideoDemos(JSON.parse(savedVideoDemos))
      } else if (typeof window !== "undefined") {
        // Si no hay videos guardados, usar los predeterminados
        localStorage.setItem("tpa-admin-video-demos", JSON.stringify(defaultVideoDemos))
        setVideoDemos(defaultVideoDemos)
      }
    }

    // Load initial data
    loadVideoDemos()

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "tpa-admin-video-demos") {
        loadVideoDemos()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events (for same-tab updates)
    const handleCustomUpdate = () => {
      loadVideoDemos()
    }

    window.addEventListener("videosUpdated", handleCustomUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("videosUpdated", handleCustomUpdate)
    }
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Mira demos del curso</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mira clases reales de nuestro curso. Conoce el estilo, profundidad y valor práctico que ofrecemos en The
            Prompt Academy.
          </p>
        </div>

        {videoDemos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {videoDemos.map((video) => {
              const videoId = extractVideoId(video.youtubeUrl)
              return (
                <Card key={video.id} className="overflow-hidden shadow-sm border border-gray-200">
                  <div className="aspect-video">
                    {videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`}
                        title={video.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Video no disponible</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{video.title}</h3>
                    {video.description && <p className="text-gray-600">{video.description}</p>}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay videos demo disponibles en este momento.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">¿Quieres ver más contenido?</h3>
              <p className="text-gray-600 mb-4">
                Estos son solo algunos ejemplos de nuestro extenso catálogo de contenido educativo.
              </p>
              <p className="text-sm text-gray-500">
                El programa completo incluye más de 20 horas de contenido video, ejercicios prácticos y casos de estudio
                reales.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
