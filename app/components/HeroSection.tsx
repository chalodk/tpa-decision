"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircleIcon, UsersIcon, MessageSquareIcon, SettingsIcon, CheckCircleIcon } from "lucide-react"
import { useState, useEffect } from "react"

export default function HeroSection() {
  const [salesEmail, setSalesEmail] = useState("ventas@thepromptacademy.com")
  const [stats, setStats] = useState({ totalProfessionals: 500 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const loadData = () => {
      try {
        const defaultSalesEmail = "ventas@thepromptacademy.com"
        const currentPassword = localStorage.getItem("tpa-current-password")
        const savedPasswords = localStorage.getItem("tpa-admin-passwords")

        if (currentPassword && savedPasswords) {
          try {
            const passwords = JSON.parse(savedPasswords)
            const activePassword = passwords.find((p: any) => p.password === currentPassword)
            if (activePassword && activePassword.salesEmail) {
              setSalesEmail(activePassword.salesEmail)
            }
          } catch (error) {
            console.error("Error parsing passwords:", error)
            setSalesEmail(defaultSalesEmail)
          }
        } else {
          setSalesEmail(defaultSalesEmail)
        }

        // Cargar estadísticas
        const savedStats = localStorage.getItem("tpa-admin-testimonial-stats")
        if (savedStats) {
          const parsedStats = JSON.parse(savedStats)
          setStats({ totalProfessionals: parsedStats.totalProfessionals })
        }
      } catch (error) {
        console.error("Error loading hero data:", error)
      }
    }

    loadData()

    // Escuchar cambios en las estadísticas
    const handleStatsUpdate = () => {
      const updatedStats = localStorage.getItem("tpa-admin-testimonial-stats")
      if (updatedStats) {
        const parsedStats = JSON.parse(updatedStats)
        setStats({ totalProfessionals: parsedStats.totalProfessionals })
      }
    }

    window.addEventListener("testimonialStatsUpdated", handleStatsUpdate)

    return () => {
      window.removeEventListener("testimonialStatsUpdated", handleStatsUpdate)
    }
  }, [isClient])

  if (!isClient) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">¡Bienvenido al Área Exclusiva!</h1>
          <h2 className="text-2xl md:text-3xl text-orange-500 font-semibold mb-6">
            Todo lo que necesitas para tomar tu decisión
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Has accedido al contenido exclusivo de The Prompt Academy. Aquí encontrarás toda la información necesaria
            para evaluar nuestro programa de capacitación en Inteligencia Artificial Generativa.
          </p>
        </div>
      </section>

      {/* Content Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">¿Qué encontrarás en esta área?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hemos preparado contenido específico para ayudarte en tu proceso de decisión. Explora cada sección para
              conocer en detalle nuestra propuesta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PlayCircleIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Demos del Curso</h3>
                    <p className="text-gray-600 mb-3">
                      Observa clases reales de nuestro programa. Conoce el estilo de enseñanza, la profundidad del
                      contenido y el valor práctico que ofrecemos.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Videos de clases magistrales</li>
                      <li>• Casos de uso empresariales</li>
                      <li>• Metodología práctica</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Referencias Institucionales</h3>
                    <p className="text-gray-600 mb-3">
                      Conecta directamente con ejecutivos que ya han vivido la experiencia. Obtén testimonios de primera
                      mano sobre los resultados.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Contacto directo por email</li>
                      <li>• Conversaciones por WhatsApp</li>
                      <li>• Experiencias reales</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquareIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Testimonios de Estudiantes</h3>
                    <p className="text-gray-600 mb-3">
                      Lee las experiencias de más de {stats.totalProfessionals} profesionales que han transformado su
                      forma de trabajar con IA generativa.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Casos de éxito documentados</li>
                      <li>• Resultados medibles</li>
                      <li>• Impacto en productividad</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SettingsIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Opciones de Personalización</h3>
                    <p className="text-gray-600 mb-3">
                      Descubre cómo adaptamos el programa a las necesidades específicas de tu organización y sector.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Módulos personalizables</li>
                      <li>• Casos de uso específicos</li>
                      <li>• Opciones adicionales</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Benefits */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">¿Por qué elegir The Prompt Academy?</h3>
                <p className="text-gray-600">Los beneficios que nos distinguen en el mercado</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Metodología Probada</h4>
                  <p className="text-gray-600 text-sm">
                    Más de {stats.totalProfessionals} profesionales capacitados con resultados medibles en productividad
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Contenido Actualizado</h4>
                  <p className="text-gray-600 text-sm">
                    Programa constantemente actualizado con las últimas tendencias en IA generativa
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Soporte Continuo</h4>
                  <p className="text-gray-600 text-sm">
                    Acompañamiento durante y después del programa para garantizar la implementación
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas específicas?</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Nuestro equipo está disponible para resolver cualquier duda sobre el programa y ayudarte en tu proceso de
            decisión.
          </p>
          <Button
            onClick={() =>
              window.open(`mailto:${salesEmail}?subject=${encodeURIComponent("Consulta sobre The Prompt Academy")}`)
            }
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Contacta a tu asesor de ventas
          </Button>
        </div>
      </section>
    </div>
  )
}
