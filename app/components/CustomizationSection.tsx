"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, AlertCircleIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useEffect } from "react"
import { getCustomizationContent, getPasswords } from "@/lib/database"

interface CustomizationContent {
  intro_text: string
  core_modules: Array<{ id: string; name: string; description?: string }>
  customizable_modules: Array<{ id: string; name: string; description?: string }>
  additional_options: Array<{ id: string; name: string; description?: string }>
}

export default function CustomizationSection() {
  const [content, setContent] = useState<CustomizationContent | null>(null)
  const [salesEmail, setSalesEmail] = useState("ventas@thepromptacademy.com")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [customizationData, passwordsData] = await Promise.all([getCustomizationContent(), getPasswords()])

        setContent(customizationData)

        // Get sales email from current password
        const currentPassword = localStorage.getItem("tpa-current-password")
        if (currentPassword && passwordsData) {
          const activePassword = passwordsData.find((p) => p.password === currentPassword)
          if (activePassword && activePassword.sales_email) {
            setSalesEmail(activePassword.sales_email)
          }
        }
      } catch (err) {
        console.error("Error loading customization content:", err)
        setError("Error al cargar el contenido de personalización")

        // Fallback to localStorage if Supabase fails
        try {
          const savedContent = localStorage.getItem("tpa-admin-customization-content")
          const savedPasswords = localStorage.getItem("tpa-admin-passwords")

          if (savedContent) {
            const parsedContent = JSON.parse(savedContent)
            setContent({
              intro_text: parsedContent.introText || parsedContent.intro_text,
              core_modules: parsedContent.coreModules || parsedContent.core_modules || [],
              customizable_modules: parsedContent.customizableModules || parsedContent.customizable_modules || [],
              additional_options: parsedContent.additionalOptions || parsedContent.additional_options || [],
            })
          } else {
            // Default content
            setContent({
              intro_text:
                "Nuestro curso se adapta a cada organización. Estas son las opciones de personalización disponibles al contratarlo.",
              core_modules: [
                {
                  id: "1",
                  name: "Fundamentos de IA Generativa y conceptos clave",
                  description: "Base teórica esencial para entender la tecnología",
                },
                {
                  id: "2",
                  name: "Técnicas de Prompting efectivo y optimización",
                  description: "Metodologías para crear prompts que generen mejores resultados",
                },
              ],
              customizable_modules: [
                {
                  id: "1",
                  name: "Casos de uso por sector (marketing, legal, educación, finanzas)",
                  description: "Aplicaciones específicas según la industria del cliente",
                },
              ],
              additional_options: [
                {
                  id: "1",
                  name: "Talleres sincrónicos en vivo con expertos",
                  description: "Sesiones interactivas con especialistas del sector",
                },
              ],
            })
          }

          // Handle sales email fallback
          const currentPassword = localStorage.getItem("tpa-current-password")
          if (currentPassword && savedPasswords) {
            try {
              const passwords = JSON.parse(savedPasswords)
              const activePassword = passwords.find((p: any) => p.password === currentPassword)
              if (activePassword && activePassword.salesEmail) {
                setSalesEmail(activePassword.salesEmail)
              }
            } catch (error) {
              console.error("Error parsing passwords:", error)
            }
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

  const handleQuoteRequest = () => {
    const subject = encodeURIComponent("Solicitud de cotización personalizada - The Prompt Academy")
    const body = encodeURIComponent(`Hola,

Me interesa obtener una cotización personalizada para el curso de The Prompt Academy.

Información de nuestra organización:
- Nombre de la empresa: 
- Sector/Industria: 
- Número aproximado de participantes: 
- Objetivos específicos: 
- Módulos de interés: 

Por favor, envíenme información detallada sobre:
- Opciones de personalización disponibles
- Precios y modalidades de pago
- Cronograma de implementación
- Soporte incluido

Quedo atento a su respuesta.

Saludos cordiales`)

    window.open(`mailto:${salesEmail}?subject=${subject}&body=${body}`)
  }

  const handleConsultationRequest = () => {
    const subject = encodeURIComponent("Solicitud de consulta gratuita - The Prompt Academy")
    const body = encodeURIComponent(`Hola,

Me gustaría agendar una consulta gratuita para conocer más sobre el curso de The Prompt Academy.

Información de contacto:
- Nombre: 
- Cargo: 
- Empresa: 
- Teléfono: 
- Email: 

Horarios preferidos:
- Días: 
- Horario: 

Temas de interés:
- Objetivos de capacitación
- Opciones de personalización
- Modalidades disponibles
- Casos de éxito similares

Quedo atento para coordinar la reunión.

Saludos cordiales`)

    window.open(`mailto:${salesEmail}?subject=${subject}&body=${body}`)
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando opciones de personalización...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && !content) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Opciones de personalización del curso</h1>
            <p className="text-lg text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Por favor, intenta recargar la página.</p>
          </div>
        </div>
      </section>
    )
  }

  if (!content) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Opciones de personalización del curso</h1>
            <p className="text-lg text-gray-600">No hay contenido de personalización disponible en este momento.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Opciones de personalización del curso</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{content.intro_text}</p>
          {error && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertCircleIcon className="h-4 w-4" />
                <span className="text-sm">Mostrando datos de respaldo</span>
              </div>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible defaultValue="core" className="space-y-4">
          <AccordionItem value="core" className="bg-white rounded-lg border shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <span className="font-semibold text-slate-800 text-lg">Módulos Core (Incluidos)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-gray-600 mb-4">
                Contenido fundamental que todos los participantes reciben, sin importar la personalización:
              </p>
              <ul className="space-y-3">
                {content.core_modules.map((module) => (
                  <li key={module.id} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">{module.name}</span>
                      {module.description && <div className="text-sm text-gray-500 mt-1">{module.description}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="personalizables" className="bg-white rounded-lg border shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ⚙️
                </div>
                <span className="font-semibold text-slate-800 text-lg">Módulos Personalizables</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-gray-600 mb-4">
                Selecciona los módulos que mejor se adapten a las necesidades de tu organización:
              </p>
              <ul className="space-y-3">
                {content.customizable_modules.map((module) => (
                  <li key={module.id} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">{module.name}</span>
                      {module.description && <div className="text-sm text-gray-500 mt-1">{module.description}</div>}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Recomendación:</strong> Selecciona 2-3 módulos para mantener el foco y maximizar el
                  aprendizaje.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="adicionales" className="bg-white rounded-lg border shadow-sm">
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  ✨
                </div>
                <span className="font-semibold text-slate-800 text-lg">Opciones Adicionales</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-gray-600 mb-4">
                Servicios premium para maximizar el valor y garantizar la implementación exitosa:
              </p>
              <ul className="space-y-3">
                {content.additional_options.map((option) => (
                  <li key={option.id} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-700 font-medium">{option.name}</span>
                      {option.description && <div className="text-sm text-gray-500 mt-1">{option.description}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Customization Examples */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">📊 Ejemplo: Sector Financiero</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Módulos core + Casos de uso financieros</li>
                <li>• Integración con sistemas bancarios</li>
                <li>• Compliance y regulaciones específicas</li>
                <li>• Talleres sincrónicos especializados</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">🛒 Ejemplo: E-commerce</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Módulos core + Marketing digital</li>
                <li>• Automatización de atención al cliente</li>
                <li>• Generación de contenido para productos</li>
                <li>• Análisis de datos de ventas</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="mt-8 bg-orange-50 border-orange-200">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">¿Necesitas una configuración específica?</h3>
              <p className="text-gray-600 mb-6">
                Nuestro equipo puede diseñar un programa completamente personalizado según las necesidades únicas de tu
                organización y sector.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleQuoteRequest} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2">
                  Solicitar cotización personalizada
                </Button>
                <Button
                  onClick={handleConsultationRequest}
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2"
                >
                  Agendar consulta gratuita
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
