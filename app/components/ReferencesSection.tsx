"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MailIcon, MessageCircleIcon, AlertCircleIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { getReferences } from "@/lib/database"
import type { Reference } from "@/lib/supabase"

const ReferencesSection = () => {
  const [references, setReferences] = useState<Reference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReferences = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getReferences()
        setReferences(data)
      } catch (err) {
        console.error("Error loading references:", err)
        setError("Error al cargar las referencias")

        // Fallback to localStorage if Supabase fails
        try {
          const savedReferences = localStorage.getItem("tpa-admin-references")
          if (savedReferences) {
            setReferences(JSON.parse(savedReferences))
          } else {
            // Default references if nothing is available
            const defaultReferences = [
              {
                id: "1",
                name: "María González",
                position: "Directora de Innovación",
                company: "Banco Santander Chile",
                email: "maria.gonzalez@santander.cl",
                whatsapp: "+56912345678",
                created_at: new Date().toISOString(),
              },
              {
                id: "2",
                name: "Carlos Rodríguez",
                position: "Gerente de Transformación Digital",
                company: "Falabella",
                email: "carlos.rodriguez@falabella.com",
                whatsapp: "+56987654321",
                created_at: new Date().toISOString(),
              },
              {
                id: "3",
                name: "Ana Martínez",
                position: "Head of Operations",
                company: "Latam Airlines",
                email: "ana.martinez@latam.com",
                whatsapp: "+56911223344",
                created_at: new Date().toISOString(),
              },
            ]
            setReferences(defaultReferences)
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadReferences()
  }, [])

  const handleEmail = (email: string, name: string) => {
    const subject = encodeURIComponent("Consulta sobre The Prompt Academy")
    const body = encodeURIComponent(
      `Hola ${name.split(" ")[0]},\n\nMe gustaría conocer tu experiencia con The Prompt Academy y los resultados que obtuvieron en su organización.\n\n¿Podrías contarme sobre:\n- Los beneficios principales que experimentaron\n- El proceso de implementación\n- Recomendaciones para nuestro caso\n\nMuchas gracias por tu tiempo.\n\nSaludos`,
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
  }

  const handleWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `Hola ${name.split(" ")[0]}, me gustaría conocer tu experiencia con The Prompt Academy. ¿Podrías contarme sobre los resultados que obtuvieron?`,
    )
    window.open(`https://wa.me/${phone.replace("+", "")}?text=${message}`, "_blank")
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando referencias...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && references.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Referencias institucionales</h1>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Por favor, intenta recargar la página.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Referencias institucionales</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conversá con personas que ya vivieron esta experiencia. Puedes contactarlas por correo o WhatsApp para
            conocer su opinión directa sobre The Prompt Academy.
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

        <Card className="overflow-hidden shadow-sm border border-gray-200">
          <CardHeader className="bg-slate-800 text-white">
            <CardTitle className="text-xl">Contactos de Referencia ({references.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800">Nombre</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800">Cargo</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-800">Empresa</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-800">Email</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-800">WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {references.map((ref, index) => (
                    <tr key={ref.id || index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{ref.name}</td>
                      <td className="px-6 py-4 text-gray-600">{ref.position}</td>
                      <td className="px-6 py-4 text-gray-600">{ref.company}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEmail(ref.email, ref.name)}
                          className="inline-flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
                          title={`Enviar email a ${ref.name}`}
                        >
                          <MailIcon className="h-5 w-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleWhatsApp(ref.whatsapp, ref.name)}
                          className="inline-flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                          title={`Contactar por WhatsApp a ${ref.name}`}
                        >
                          <MessageCircleIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">💡 Consejos para el contacto</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>
                  • <strong>Sé específico:</strong> Pregunta sobre resultados concretos y métricas de éxito
                </li>
                <li>
                  • <strong>Menciona tu contexto:</strong> Comparte información sobre tu organización y objetivos
                </li>
                <li>
                  • <strong>Respeta su tiempo:</strong> Estas personas han accedido voluntariamente a ser referencias
                </li>
                <li>
                  • <strong>Pregunta por desafíos:</strong> Conoce también las dificultades que enfrentaron
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ReferencesSection
