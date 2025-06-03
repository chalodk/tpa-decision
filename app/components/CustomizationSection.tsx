"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useEffect } from "react"

interface CustomizationContent {
  introText: string
  coreModules: Array<{ id: string; name: string; description?: string }>
  customizableModules: Array<{ id: string; name: string; description?: string }>
  additionalOptions: Array<{ id: string; name: string; description?: string }>
}

export default function CustomizationSection() {
  const [content, setContent] = useState<CustomizationContent>({
    introText:
      "Nuestro curso se adapta a cada organización. Estas son las opciones de personalización disponibles al contratarlo.",
    coreModules: [],
    customizableModules: [],
    additionalOptions: [],
  })
  const [salesEmail, setSalesEmail] = useState("ventas@thepromptacademy.com")

  useEffect(() => {
    const defaultContent = {
      introText:
        "Nuestro curso se adapta a cada organización. Estas son las opciones de personalización disponibles al contratarlo.",
      coreModules: [
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
        {
          id: "3",
          name: "Aplicaciones en productividad individual y equipos",
          description: "Casos prácticos para mejorar la eficiencia personal y grupal",
        },
        {
          id: "4",
          name: "Herramientas principales: ChatGPT, Claude, Gemini",
          description: "Dominio de las plataformas más utilizadas en el mercado",
        },
        {
          id: "5",
          name: "Ética y mejores prácticas en IA empresarial",
          description: "Uso responsable y consideraciones éticas en entornos corporativos",
        },
      ],
      customizableModules: [
        {
          id: "1",
          name: "Casos de uso por sector (marketing, legal, educación, finanzas)",
          description: "Aplicaciones específicas según la industria del cliente",
        },
        {
          id: "2",
          name: "Automatización con herramientas no-code (Zapier, Make)",
          description: "Integración de IA con flujos de trabajo automatizados",
        },
        {
          id: "3",
          name: "Integraciones con Microsoft 365 y Google Workspace",
          description: "Optimización de herramientas de productividad empresarial",
        },
        {
          id: "4",
          name: "Creación de chatbots y asistentes virtuales",
          description: "Desarrollo de soluciones conversacionales personalizadas",
        },
        {
          id: "5",
          name: "Análisis de datos y generación de reportes",
          description: "Uso de IA para insights y visualización de información",
        },
        {
          id: "6",
          name: "Gestión del cambio y adopción organizacional",
          description: "Estrategias para implementar IA en equipos de trabajo",
        },
      ],
      additionalOptions: [
        {
          id: "1",
          name: "Talleres sincrónicos en vivo con expertos",
          description: "Sesiones interactivas con especialistas del sector",
        },
        {
          id: "2",
          name: "Branding institucional en todos los materiales",
          description: "Personalización visual con la identidad de la empresa",
        },
        {
          id: "3",
          name: "Diagnóstico inicial y plan de implementación",
          description: "Evaluación previa y roadmap personalizado",
        },
        {
          id: "4",
          name: "Sesiones de coaching 1:1 personalizadas",
          description: "Acompañamiento individual para casos específicos",
        },
        {
          id: "5",
          name: "Certificación oficial de participación",
          description: "Documento formal que acredita la capacitación",
        },
        {
          id: "6",
          name: "Soporte técnico extendido (3-6 meses)",
          description: "Asistencia continua post-capacitación",
        },
        {
          id: "7",
          name: "Acceso a comunidad exclusiva de alumni",
          description: "Red de contactos y intercambio de experiencias",
        },
        {
          id: "8",
          name: "Actualizaciones de contenido por 12 meses",
          description: "Acceso a nuevos materiales y tendencias",
        },
      ],
    }

    const loadContent = () => {
      const savedContent = localStorage.getItem("tpa-admin-customization-content")
      if (savedContent) {
        setContent(JSON.parse(savedContent))
      } else if (typeof window !== "undefined") {
        localStorage.setItem("tpa-admin-customization-content", JSON.stringify(defaultContent))
        setContent(defaultContent)
      }
    }

    const loadSalesEmail = () => {
      const currentPassword = localStorage.getItem("tpa-current-password")
      const savedPasswords = localStorage.getItem("tpa-admin-passwords")

      if (currentPassword && savedPasswords) {
        try {
          const passwords = JSON.parse(savedPasswords)
          const activePassword = passwords.find((p) => p.password === currentPassword)
          if (activePassword && activePassword.salesEmail) {
            setSalesEmail(activePassword.salesEmail)
          }
        } catch (error) {
          console.error("Error parsing passwords:", error)
          setSalesEmail("ventas@thepromptacademy.com")
        }
      }
    }

    loadContent()
    loadSalesEmail()

    // Escuchar cambios
    const handleContentUpdate = () => loadContent()
    window.addEventListener("customizationUpdated", handleContentUpdate)

    return () => {
      window.removeEventListener("customizationUpdated", handleContentUpdate)
    }
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Opciones de personalización del curso</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{content.introText}</p>
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
                {content.coreModules.map((module) => (
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
                {content.customizableModules.map((module) => (
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
                {content.additionalOptions.map((option) => (
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
