"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon, StarIcon, AlertCircleIcon } from "lucide-react"
import { getTestimonials, getTestimonialStats } from "@/lib/database"
import type { Testimonial, TestimonialStats } from "@/lib/supabase"

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<TestimonialStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const testimonialsPerPage = 3

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [testimonialsData, statsData] = await Promise.all([getTestimonials(), getTestimonialStats()])

        setTestimonials(testimonialsData)
        setStats(statsData)
      } catch (err) {
        console.error("Error loading testimonials:", err)
        setError("Error al cargar los testimonios")

        // Fallback to localStorage if Supabase fails
        try {
          const savedTestimonials = localStorage.getItem("tpa-admin-testimonials")
          const savedStats = localStorage.getItem("tpa-admin-testimonial-stats")

          if (savedTestimonials) {
            setTestimonials(JSON.parse(savedTestimonials))
          } else {
            // Default testimonials
            const defaultTestimonials = [
              {
                id: "1",
                text: "El curso de The Prompt Academy transformó completamente nuestra forma de trabajar. En 3 meses implementamos soluciones de IA que aumentaron nuestra productividad en un 40%. El ROI fue evidente desde la primera semana.",
                name: "Roberto Silva",
                position: "Gerente de Operaciones",
                company: "Empresa Retail Líder",
                linkedin_url: "https://linkedin.com/in/roberto-silva",
                created_at: new Date().toISOString(),
              },
              {
                id: "2",
                text: "La metodología es excelente y muy práctica. Nuestro equipo pasó de no conocer nada sobre IA generativa a implementar chatbots y automatizaciones en solo 2 semanas. Los instructores son expertos reales.",
                name: "Patricia López",
                position: "Directora de Marketing",
                company: "Fintech Innovadora",
                created_at: new Date().toISOString(),
              },
              {
                id: "3",
                text: "Superó nuestras expectativas completamente. No solo aprendimos sobre IA, sino que desarrollamos una estrategia integral para nuestra transformación digital. El acompañamiento post-curso fue fundamental.",
                name: "Miguel Torres",
                position: "CTO",
                company: "Startup Tecnológica",
                linkedin_url: "https://linkedin.com/in/miguel-torres-cto",
                created_at: new Date().toISOString(),
              },
            ]
            setTestimonials(defaultTestimonials)
          }

          if (savedStats) {
            setStats(JSON.parse(savedStats))
          } else {
            // Default stats
            setStats({
              id: "1",
              total_professionals: 500,
              satisfaction_rate: 95,
              productivity_increase: 40,
              intro_text:
                "Más de 500 personas han pasado por nuestros cursos. Aquí puedes leer lo que dicen quienes ya transformaron su forma de trabajar gracias a la IA generativa.",
              updated_at: new Date().toISOString(),
            })
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calcular testimonios para la página actual
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)
  const startIndex = currentPage * testimonialsPerPage
  const currentTestimonials = testimonials.slice(startIndex, startIndex + testimonialsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando testimonios...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && testimonials.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Testimonios de estudiantes</h1>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Por favor, intenta recargar la página.</p>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Testimonios de estudiantes</h1>
            <p className="text-lg text-gray-600">No hay testimonios disponibles en este momento.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Testimonios de estudiantes</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {stats?.intro_text ||
              "Conoce las experiencias de quienes ya transformaron su forma de trabajar gracias a la IA generativa."}
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

        {/* Estadísticas */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6 bg-orange-50 border-orange-200">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-orange-600 mb-2">{stats.total_professionals}+</div>
                <div className="text-gray-600 font-medium">Profesionales capacitados</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-green-50 border-green-200">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-green-600 mb-2">{stats.satisfaction_rate}%</div>
                <div className="text-gray-600 font-medium">Satisfacción promedio</div>
              </CardContent>
            </Card>
            <Card className="text-center p-6 bg-blue-50 border-blue-200">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stats.productivity_increase}%</div>
                <div className="text-gray-600 font-medium">Aumento en productividad</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grid de testimonios */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {currentTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="shadow-lg border border-gray-200 h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex flex-col items-center text-center flex-grow">
                  <QuoteIcon className="h-8 w-8 text-orange-500 mb-4" />

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 mb-6 leading-relaxed flex-grow">"{testimonial.text}"</blockquote>

                  <div className="space-y-1 mt-auto">
                    {testimonial.name && <div className="font-semibold text-slate-800">{testimonial.name}</div>}
                    {testimonial.position && (
                      <div className="text-orange-600 font-medium text-sm">{testimonial.position}</div>
                    )}
                    {testimonial.company && <div className="text-gray-600 text-sm">{testimonial.company}</div>}
                    {testimonial.linkedin_url && (
                      <a
                        href={testimonial.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 mr-1"
                        >
                          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                        </svg>
                        Ver perfil
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Paginador */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-12">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentPage === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              }`}
              aria-label="Página anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentPage === i ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                  }`}
                  aria-label={`Ir a página ${i + 1}`}
                  aria-current={currentPage === i ? "page" : undefined}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentPage === totalPages - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              }`}
              aria-label="Página siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
