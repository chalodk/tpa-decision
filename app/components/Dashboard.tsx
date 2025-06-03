"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOutIcon, PlayCircleIcon, UsersIcon, MessageSquareIcon, SettingsIcon } from "lucide-react"
import dynamic from "next/dynamic"

// Importar secciones dinámicamente
const HeroSection = dynamic(() => import("./HeroSection"), {
  ssr: false,
  loading: () => <div className="py-16 text-center">Cargando...</div>,
})

const DemosSection = dynamic(() => import("./DemosSection"), {
  ssr: false,
  loading: () => <div className="py-16 text-center">Cargando demos...</div>,
})

const ReferencesSection = dynamic(() => import("./ReferencesSection"), {
  ssr: false,
  loading: () => <div className="py-16 text-center">Cargando referencias...</div>,
})

const TestimonialsSection = dynamic(() => import("./TestimonialsSection"), {
  ssr: false,
  loading: () => <div className="py-16 text-center">Cargando testimonios...</div>,
})

const CustomizationSection = dynamic(() => import("./CustomizationSection"), {
  ssr: false,
  loading: () => <div className="py-16 text-center">Cargando personalización...</div>,
})

interface DashboardProps {
  onLogout: () => void
  currentPassword: string
}

export default function Dashboard({ onLogout, currentPassword }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("hero")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = () => {
    onLogout()
  }

  const handleSectionChange = (sectionId: string) => {
    try {
      setActiveSection(sectionId)
      // Guardar la sección activa en localStorage para persistencia
      if (typeof window !== "undefined") {
        localStorage.setItem("tpa-active-section", sectionId)
      }
    } catch (error) {
      console.error("Error changing section:", error)
    }
  }

  // Recuperar sección activa al cargar
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      const savedSection = localStorage.getItem("tpa-active-section")
      if (savedSection) {
        setActiveSection(savedSection)
      }
    }
  }, [isClient])

  const sections = [
    { id: "hero", label: "Inicio", icon: null },
    { id: "demos", label: "Demos del curso", icon: PlayCircleIcon },
    { id: "referencias", label: "Referencias", icon: UsersIcon },
    { id: "testimonios", label: "Testimonios", icon: MessageSquareIcon },
    { id: "personalizacion", label: "Personalización", icon: SettingsIcon },
  ]

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-800 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-slate-800 rounded-lg flex items-center justify-center font-bold">
                3C
              </div>
              <div className="font-semibold">The Prompt Academy</div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-orange-600 text-white border-orange-600 hover:bg-white hover:text-orange-600"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${
                  activeSection === section.id
                    ? "bg-orange-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {section.icon && <section.icon className="h-4 w-4" />}
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {activeSection === "hero" && <HeroSection />}
        {activeSection === "demos" && <DemosSection />}
        {activeSection === "referencias" && <ReferencesSection />}
        {activeSection === "testimonios" && <TestimonialsSection />}
        {activeSection === "personalizacion" && <CustomizationSection />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-white text-slate-800 rounded-lg flex items-center justify-center font-bold">
                3C
              </div>
              <div className="font-semibold">The Prompt Academy</div>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} The Prompt Academy. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
