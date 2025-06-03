"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MailIcon, MessageCircleIcon } from "lucide-react"
import { useState, useEffect } from "react"

const ReferencesSection = () => {
  const [references, setReferences] = useState([])

  useEffect(() => {
    const defaultReferences = [
      {
        id: "1",
        name: "María González",
        position: "Directora de Innovación",
        company: "Banco Santander Chile",
        email: "maria.gonzalez@santander.cl",
        whatsapp: "+56912345678",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Carlos Rodríguez",
        position: "Gerente de Transformación Digital",
        company: "Falabella",
        email: "carlos.rodriguez@falabella.com",
        whatsapp: "+56987654321",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Ana Martínez",
        position: "Head of Operations",
        company: "Latam Airlines",
        email: "ana.martinez@latam.com",
        whatsapp: "+56911223344",
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Roberto Silva",
        position: "Director de Tecnología",
        company: "BCI",
        email: "roberto.silva@bci.cl",
        whatsapp: "+56955667788",
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Patricia López",
        position: "Gerente de Capacitación",
        company: "Entel",
        email: "patricia.lopez@entel.cl",
        whatsapp: "+56933445566",
        createdAt: new Date().toISOString(),
      },
    ]

    const loadReferences = () => {
      const savedReferences = localStorage.getItem("tpa-admin-references")
      if (savedReferences) {
        setReferences(JSON.parse(savedReferences))
      } else if (typeof window !== "undefined") {
        // Si no hay referencias guardadas, usar las predeterminadas
        localStorage.setItem("tpa-admin-references", JSON.stringify(defaultReferences))
        setReferences(defaultReferences)
      }
    }

    // Load initial data
    loadReferences()

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "tpa-admin-references") {
        loadReferences()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events (for same-tab updates)
    const handleCustomUpdate = () => {
      loadReferences()
    }

    window.addEventListener("referencesUpdated", handleCustomUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("referencesUpdated", handleCustomUpdate)
    }
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Referencias institucionales</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conversá con personas que ya vivieron esta experiencia. Puedes contactarlas por correo o WhatsApp para
            conocer su opinión directa sobre The Prompt Academy.
          </p>
        </div>

        <Card className="overflow-hidden shadow-sm border border-gray-200">
          <CardHeader className="bg-slate-800 text-white">
            <CardTitle className="text-xl">Contactos de Referencia</CardTitle>
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
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
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
