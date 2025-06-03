"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircleIcon } from "lucide-react"
import { getVideoDemos } from "@/lib/database"
import type { VideoDemo } from "@/lib/supabase"

const extractVideoId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  return match ? match[1] : null
}

export default function DemosSection() {
  const [videoDemos, setVideoDemos] = useState<VideoDemo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideoDemos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getVideoDemos()
        setVideoDemos(data)
      } catch (err) {
        console.error("Error loading video demos:", err)
        setError("Error al cargar los videos demo")

        // Fallback to localStorage if Supabase fails
        try {
          const savedVideoDemos = localStorage.getItem("tpa-admin-video-demos")
          if (savedVideoDemos) {
            setVideoDemos(JSON.parse(savedVideoDemos))
          } else {
            // Default video demos if nothing is available
            const defaultVideoDemos = [
              {
                id: "1",
                title: "Fundamentos de IA Generativa",
                youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                description: "Introducción completa a los conceptos básicos y aplicaciones prácticas",
                created_at: new Date().toISOString(),
              },
              {
                id: "2",
                title: "Técnicas Avanzadas de Prompting",
                youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                description: "Metodologías para crear prompts efectivos y obtener mejores resultados",
                created_at: new Date().toISOString(),
              },
              {
                id: "3",
                title: "Aplicaciones Empresariales",
                youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                description: "Casos de uso reales en diferentes sectores e industrias",
                created_at: new Date().toISOString(),
              },
            ]
            setVideoDemos(defaultVideoDemos)
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadVideoDemos()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando videos demo...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && videoDemos.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Mira demos del curso</h1>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Por favor, intenta recargar la página.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Mira demos del curso</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mira clases reales de nuestro curso. Conoce el estilo, profundidad y valor práctico que ofrecemos en The
            Prompt Academy.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertCircleIcon className="h-4 w-4" />
                <span className="text-sm">Mostrando datos de respaldo</span>
              </div>
            </div>
          )}
        </div>

        {videoDemos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {videoDemos.map((video) => {
              const videoId = extractVideoId(video.youtube_url)
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
