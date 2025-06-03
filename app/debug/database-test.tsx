"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, isSupabaseAvailable } from "@/lib/supabase"
import {
  getPasswords,
  createPassword,
  updatePassword,
  deletePassword,
  getReferences,
  createReference,
  getVideoDemos,
  createVideoDemo,
  getTestimonials,
  createTestimonial,
  getTestimonialStats,
  updateTestimonialStats,
  getSessions,
  createSession,
  getCustomizationContent,
  updateCustomizationContent,
} from "@/lib/database"

export default function DatabaseTest() {
  const [results, setResults] = useState<Array<{ name: string; status: "success" | "error"; message: string }>>([])
  const [isRunning, setIsRunning] = useState(false)

  const addResult = (name: string, status: "success" | "error", message: string) => {
    setResults((prev) => [...prev, { name, status, message }])
  }

  const runTests = async () => {
    setResults([])
    setIsRunning(true)

    try {
      // Check Supabase connection
      addResult("Conexión Supabase", "success", "Iniciando pruebas de conexión...")

      if (!isSupabaseAvailable()) {
        addResult("Conexión Supabase", "error", "Variables de entorno de Supabase no configuradas")
        return
      }

      // Test direct connection
      try {
        const { data, error } = await supabase.from("passwords").select("count")
        if (error) throw error
        addResult("Conexión Supabase", "success", "Conexión directa exitosa")
      } catch (error) {
        addResult("Conexión Supabase", "error", `Error en conexión directa: ${error.message}`)
        return
      }

      // Test passwords table
      try {
        // Get passwords
        const passwords = await getPasswords()
        addResult(
          "Tabla passwords (GET)",
          "success",
          `Obtenidas ${passwords.length} contraseñas: ${passwords.map((p) => p.password).join(", ")}`,
        )

        // Create password
        const newPassword = {
          password: `test-${Date.now()}`,
          sales_email: "test@example.com",
        }
        const createdPassword = await createPassword(newPassword)
        addResult(
          "Tabla passwords (INSERT)",
          "success",
          `Contraseña creada: ${createdPassword.password} (ID: ${createdPassword.id})`,
        )

        // Update password
        const updatedPassword = await updatePassword(createdPassword.id, {
          sales_email: "updated@example.com",
        })
        addResult(
          "Tabla passwords (UPDATE)",
          "success",
          `Contraseña actualizada: ${updatedPassword.password} (Email: ${updatedPassword.sales_email})`,
        )

        // Delete password
        await deletePassword(createdPassword.id)
        addResult("Tabla passwords (DELETE)", "success", `Contraseña eliminada: ${createdPassword.password}`)
      } catch (error) {
        addResult("Tabla passwords", "error", `Error en operaciones CRUD: ${error.message}`)
      }

      // Test references table
      try {
        // Get references
        const references = await getReferences()
        addResult(
          "Tabla references_text (GET)",
          "success",
          `Obtenidas ${references.length} referencias: ${references.map((r) => r.name).join(", ")}`,
        )

        // Create reference
        const newReference = {
          name: `Test Reference ${Date.now()}`,
          position: "Test Position",
          company: "Test Company",
          email: "test@example.com",
          whatsapp: "+1234567890",
        }
        const createdReference = await createReference(newReference)
        addResult(
          "Tabla references_text (INSERT)",
          "success",
          `Referencia creada: ${createdReference.name} (ID: ${createdReference.id})`,
        )
      } catch (error) {
        addResult("Tabla references_text", "error", `Error en operaciones CRUD: ${error.message}`)
      }

      // Test video_demos table
      try {
        // Get video demos
        const videoDemos = await getVideoDemos()
        addResult(
          "Tabla video_demos (GET)",
          "success",
          `Obtenidos ${videoDemos.length} videos: ${videoDemos.map((v) => v.title).join(", ")}`,
        )

        // Create video demo
        const newVideoDemo = {
          title: `Test Video ${Date.now()}`,
          youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          description: "Test Description",
        }
        const createdVideoDemo = await createVideoDemo(newVideoDemo)
        addResult(
          "Tabla video_demos (INSERT)",
          "success",
          `Video demo creado: ${createdVideoDemo.title} (ID: ${createdVideoDemo.id})`,
        )
      } catch (error) {
        addResult("Tabla video_demos", "error", `Error en operaciones CRUD: ${error.message}`)
      }

      // Test testimonials table
      try {
        // Get testimonials
        const testimonials = await getTestimonials()
        addResult(
          "Tabla testimonials (GET)",
          "success",
          `Obtenidos ${testimonials.length} testimonios: ${testimonials.map((t) => t.name || "Anónimo").join(", ")}`,
        )

        // Create testimonial
        const newTestimonial = {
          text: `Test Testimonial ${Date.now()}`,
          name: "Test Name",
          position: "Test Position",
          company: "Test Company",
        }
        const createdTestimonial = await createTestimonial(newTestimonial)
        addResult(
          "Tabla testimonials (INSERT)",
          "success",
          `Testimonio creado: ${createdTestimonial.name} (ID: ${createdTestimonial.id})`,
        )
      } catch (error) {
        addResult("Tabla testimonials", "error", `Error en operaciones CRUD: ${error.message}`)
      }

      // Test testimonial_stats table
      try {
        // Get testimonial stats
        const stats = await getTestimonialStats()
        addResult(
          "Tabla testimonial_stats (GET)",
          "success",
          `Estadísticas obtenidas: ${stats ? `${stats.total_professionals} profesionales` : "No hay estadísticas"}`,
        )

        // Update testimonial stats
        if (stats) {
          const updatedStats = await updateTestimonialStats({
            total_professionals: stats.total_professionals + 1,
            satisfaction_rate: stats.satisfaction_rate,
            productivity_increase: stats.productivity_increase,
            intro_text: stats.intro_text,
          })
          addResult(
            "Tabla testimonial_stats (UPDATE)",
            "success",
            `Estadísticas actualizadas: ${updatedStats.total_professionals} profesionales`,
          )
        } else {
          const newStats = await updateTestimonialStats({
            total_professionals: 501,
            satisfaction_rate: 95,
            productivity_increase: 40,
            intro_text:
              "Más de 500 personas han pasado por nuestros cursos. Aquí puedes leer lo que dicen quienes ya transformaron su forma de trabajar gracias a la IA generativa.",
          })
          addResult(
            "Tabla testimonial_stats (INSERT)",
            "success",
            `Estadísticas creadas: ${newStats.total_professionals} profesionales`,
          )
        }
      } catch (error) {
        addResult("Tabla testimonial_stats", "error", `Error en operaciones CRUD: ${error.message}`)
      }

      // Test sessions table
      try {
        // Get sessions
        const sessions = await getSessions()
        addResult("Tabla sessions (GET)", "success", `Obtenidas ${sessions.length} sesiones`)

        // Create session
        const newSession = {
          password: "test-session",
          start_time: new Date().toISOString(),
          sections_visited: ["home", "testimonials"],
          is_active: true,
        }
        const createdSession = await createSession(newSession)
        addResult("Tabla sessions (INSERT)", "success", `Sesión creada: ID ${createdSession.id}`)
      } catch (error) {
        addResult("Tabla sessions", "error", `Error en operaciones CRUD: ${error.message}`)
      }

      // Test customization_content table
      try {
        // Get customization content
        const content = await getCustomizationContent()
        addResult(
          "Tabla customization_content (GET)",
          "success",
          `Contenido obtenido: ${content ? "Sí" : "No hay contenido"}`,
        )

        // Update customization content
        const defaultContent = {
          intro_text: "Texto actualizado de prueba",
          core_modules: [{ id: "test", name: "Test Module", description: "Test Description" }],
          customizable_modules: [],
          additional_options: [],
        }

        const updatedContent = await updateCustomizationContent(defaultContent)
        addResult(
          "Tabla customization_content (UPDATE)",
          "success",
          `Contenido actualizado: ${updatedContent.intro_text}`,
        )
      } catch (error) {
        addResult("Tabla customization_content", "error", `Error en operaciones CRUD: ${error.message}`)
      }

      addResult("Pruebas completadas", "success", "Todas las pruebas han finalizado")
    } catch (error) {
      addResult("Error general", "error", `Error inesperado: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Prueba de Conexión a Base de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button onClick={runTests} disabled={isRunning} className="bg-orange-600 hover:bg-orange-700">
              {isRunning ? "Ejecutando pruebas..." : "Ejecutar pruebas de base de datos"}
            </Button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.status === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${result.status === "success" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <h3 className={`font-medium ${result.status === "success" ? "text-green-800" : "text-red-800"}`}>
                    {result.name}
                  </h3>
                </div>
                <p className={`mt-1 text-sm ${result.status === "success" ? "text-green-700" : "text-red-700"}`}>
                  {result.message}
                </p>
              </div>
            ))}

            {results.length === 0 && !isRunning && (
              <div className="text-center py-8 text-gray-500">
                Haz clic en el botón para ejecutar las pruebas de base de datos
              </div>
            )}

            {isRunning && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Ejecutando pruebas...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
