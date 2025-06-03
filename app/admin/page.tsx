"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LockIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  BarChart3Icon,
  UsersIcon,
  PlayCircleIcon,
  MessageSquareIcon,
  SettingsIcon,
  LinkedinIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrackingProvider } from "../contexts/TrackingContext"

interface Password {
  id: string
  password: string
  salesEmail: string
  createdAt: string
}

interface Session {
  id: string
  password: string
  startTime: string
  endTime?: string
  duration?: number
  sectionsVisited: string[]
  isActive: boolean
}

interface Reference {
  id: string
  name: string
  position: string
  company: string
  email: string
  whatsapp: string
  createdAt: string
}

interface VideoDemo {
  id: string
  title: string
  youtubeUrl: string
  description?: string
  createdAt: string
}

interface TestimonialStats {
  totalProfessionals: number
  satisfactionRate: number
  productivityIncrease: number
  introText: string
}

interface Testimonial {
  id: string
  text: string
  name?: string
  position?: string
  company?: string
  avatar?: string
  linkedinUrl?: string
  createdAt: string
}

interface CustomizationContent {
  introText: string
  coreModules: Array<{ id: string; name: string; description?: string }>
  customizableModules: Array<{ id: string; name: string; description?: string }>
  additionalOptions: Array<{ id: string; name: string; description?: string }>
}

function AdminContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [masterPassword, setMasterPassword] = useState("")
  const [error, setError] = useState("")
  const [passwords, setPasswords] = useState<Password[]>([])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [newSalesEmail, setNewSalesEmail] = useState("")
  const [editingPassword, setEditingPassword] = useState<Password | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "passwords" | "tracking" | "referencias" | "videos" | "testimonios" | "personalizacion"
  >("passwords")
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedPasswordSessions, setSelectedPasswordSessions] = useState<Session[]>([])
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false)
  const [selectedPasswordForSessions, setSelectedPasswordForSessions] = useState("")
  const [references, setReferences] = useState<Reference[]>([])
  const [newReference, setNewReference] = useState({
    name: "",
    position: "",
    company: "",
    email: "",
    whatsapp: "",
  })
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [isReferenceDialogOpen, setIsReferenceDialogOpen] = useState(false)
  const [videoDemos, setVideoDemos] = useState<VideoDemo[]>([])
  const [newVideoDemo, setNewVideoDemo] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  })
  const [editingVideoDemo, setEditingVideoDemo] = useState<VideoDemo | null>(null)
  const [isVideoDemoDialogOpen, setIsVideoDemoDialogOpen] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [testimonialStats, setTestimonialStats] = useState<TestimonialStats>({
    totalProfessionals: 500,
    satisfactionRate: 95,
    productivityIncrease: 40,
    introText:
      "Más de 500 personas han pasado por nuestros cursos. Aquí puedes leer lo que dicen quienes ya transformaron su forma de trabajar gracias a la IA generativa.",
  })
  const [newTestimonial, setNewTestimonial] = useState({
    text: "",
    name: "",
    position: "",
    company: "",
    avatar: "",
    linkedinUrl: "",
  })
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false)
  const [customizationContent, setCustomizationContent] = useState<CustomizationContent>({
    introText:
      "Nuestro curso se adapta a cada organización. Estas son las opciones de personalización disponibles al contratarlo.",
    coreModules: [],
    customizableModules: [],
    additionalOptions: [],
  })
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false)
  const [editingCustomizationSection, setEditingCustomizationSection] = useState<
    "core" | "customizable" | "additional" | null
  >(null)
  const [newCustomizationItem, setNewCustomizationItem] = useState({ name: "", description: "" })
  const [editingCustomizationItem, setEditingCustomizationItem] = useState<{
    id: string
    name: string
    description?: string
  } | null>(null)

  const MASTER_PASSWORD = "admin2025"

  useEffect(() => {
    // Datos predeterminados
    const defaultPasswords = [
      {
        id: "1",
        password: "demo2025",
        salesEmail: "ventas@thepromptacademy.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        password: "tpa-client",
        salesEmail: "asesor@thepromptacademy.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        password: "academy123",
        salesEmail: "comercial@thepromptacademy.com",
        createdAt: new Date().toISOString(),
      },
    ]

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

    const defaultCustomizationContent = {
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

    // Función para inicializar datos
    const initializeData = () => {
      // Inicializar contraseñas
      const savedPasswords = localStorage.getItem("tpa-admin-passwords")
      if (!savedPasswords) {
        setPasswords(defaultPasswords)
        localStorage.setItem("tpa-admin-passwords", JSON.stringify(defaultPasswords))
      } else {
        setPasswords(JSON.parse(savedPasswords))
      }

      // Inicializar sesiones
      const savedSessions = localStorage.getItem("tpa-tracking-sessions")
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions))
      }

      // Inicializar referencias
      const savedReferences = localStorage.getItem("tpa-admin-references")
      if (!savedReferences) {
        setReferences(defaultReferences)
        localStorage.setItem("tpa-admin-references", JSON.stringify(defaultReferences))
        window.dispatchEvent(new CustomEvent("referencesUpdated"))
      } else {
        setReferences(JSON.parse(savedReferences))
      }

      // Inicializar videos demo
      const savedVideoDemos = localStorage.getItem("tpa-admin-video-demos")
      if (!savedVideoDemos) {
        setVideoDemos(defaultVideoDemos)
        localStorage.setItem("tpa-admin-video-demos", JSON.stringify(defaultVideoDemos))
        window.dispatchEvent(new CustomEvent("videosUpdated"))
      } else {
        setVideoDemos(JSON.parse(savedVideoDemos))
      }

      // Inicializar testimonios
      const defaultTestimonials = [
        {
          id: "1",
          text: "El curso de The Prompt Academy transformó completamente nuestra forma de trabajar. En 3 meses implementamos soluciones de IA que aumentaron nuestra productividad en un 40%. El ROI fue evidente desde la primera semana.",
          name: "Roberto Silva",
          position: "Gerente de Operaciones",
          company: "Empresa Retail Líder",
          linkedinUrl: "https://linkedin.com/in/roberto-silva",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          text: "La metodología es excelente y muy práctica. Nuestro equipo pasó de no conocer nada sobre IA generativa a implementar chatbots y automatizaciones en solo 2 semanas. Los instructores son expertos reales.",
          name: "Patricia López",
          position: "Directora de Marketing",
          company: "Fintech Innovadora",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          text: "Superó nuestras expectativas completamente. No solo aprendimos sobre IA, sino que desarrollamos una estrategia integral para nuestra transformación digital. El acompañamiento post-curso fue fundamental.",
          name: "Miguel Torres",
          position: "CTO",
          company: "Startup Tecnológica",
          linkedinUrl: "https://linkedin.com/in/miguel-torres-cto",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          text: "La inversión se recuperó en menos de 6 meses. Ahora tenemos un equipo capacitado que puede implementar soluciones de IA de forma autónoma. Recomiendo totalmente The Prompt Academy.",
          name: "Carmen Ruiz",
          position: "Directora de Innovación",
          company: "Corporación Multinacional",
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          text: "El contenido es actualizado, relevante y aplicable inmediatamente. Nuestros procesos de atención al cliente mejoraron significativamente gracias a las técnicas aprendidas.",
          name: "Diego Fernández",
          position: "Head of Customer Experience",
          company: "Empresa de Servicios",
          linkedinUrl: "https://linkedin.com/in/diego-fernandez-cx",
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          text: "Excelente programa. La combinación de teoría y práctica es perfecta. Nuestro equipo está motivado y aplicando todo lo aprendido en proyectos reales con resultados medibles.",
          name: "Andrea Morales",
          position: "Gerente de Transformación",
          company: "Banco Regional",
          createdAt: new Date().toISOString(),
        },
      ]

      const savedTestimonials = localStorage.getItem("tpa-admin-testimonials")
      if (!savedTestimonials) {
        setTestimonials(defaultTestimonials)
        localStorage.setItem("tpa-admin-testimonials", JSON.stringify(defaultTestimonials))
        window.dispatchEvent(new CustomEvent("testimonialsUpdated"))
      } else {
        setTestimonials(JSON.parse(savedTestimonials))
      }

      // Inicializar estadísticas de testimonios
      const savedStats = localStorage.getItem("tpa-admin-testimonial-stats")
      if (!savedStats) {
        localStorage.setItem("tpa-admin-testimonial-stats", JSON.stringify(testimonialStats))
        window.dispatchEvent(new CustomEvent("testimonialStatsUpdated"))
      } else {
        setTestimonialStats(JSON.parse(savedStats))
      }

      // Inicializar contenido de personalización
      const savedCustomization = localStorage.getItem("tpa-admin-customization-content")
      if (!savedCustomization) {
        setCustomizationContent(defaultCustomizationContent)
        localStorage.setItem("tpa-admin-customization-content", JSON.stringify(defaultCustomizationContent))
        window.dispatchEvent(new CustomEvent("customizationUpdated"))
      } else {
        setCustomizationContent(JSON.parse(savedCustomization))
      }
    }

    // Ejecutar inicialización solo en el cliente
    if (typeof window !== "undefined") {
      initializeData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (masterPassword === MASTER_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Contraseña maestra incorrecta.")
    }
  }

  const savePasswords = (newPasswords: Password[]) => {
    setPasswords(newPasswords)
    localStorage.setItem("tpa-admin-passwords", JSON.stringify(newPasswords))
  }

  const handleAddPassword = () => {
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (newPassword.length < 3) {
      setError("La contraseña debe tener al menos 3 caracteres.")
      return
    }
    if (!validateEmail(newSalesEmail)) {
      setError("El formato del correo del asesor no es válido.")
      return
    }

    const newPasswordObj: Password = {
      id: Date.now().toString(),
      password: newPassword,
      salesEmail: newSalesEmail,
      createdAt: new Date().toISOString(),
    }

    const updatedPasswords = [...passwords, newPasswordObj]
    savePasswords(updatedPasswords)
    setNewPassword("")
    setConfirmPassword("")
    setNewSalesEmail("")
    setError("")
    setIsDialogOpen(false)
  }

  const handleEditPassword = () => {
    if (!editingPassword) return
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (newPassword.length < 3) {
      setError("La contraseña debe tener al menos 3 caracteres.")
      return
    }
    if (!validateEmail(newSalesEmail)) {
      setError("El formato del correo del asesor no es válido.")
      return
    }

    const updatedPasswords = passwords.map((p) =>
      p.id === editingPassword.id ? { ...p, password: newPassword, salesEmail: newSalesEmail } : p,
    )
    savePasswords(updatedPasswords)
    setEditingPassword(null)
    setNewPassword("")
    setConfirmPassword("")
    setNewSalesEmail("")
    setError("")
    setIsDialogOpen(false)
  }

  const handleDeletePassword = (id: string) => {
    const updatedPasswords = passwords.filter((p) => p.id !== id)
    savePasswords(updatedPasswords)
  }

  const openEditDialog = (password: Password) => {
    setEditingPassword(password)
    setNewPassword(password.password)
    setConfirmPassword(password.password)
    setNewSalesEmail(password.salesEmail)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingPassword(null)
    setNewPassword("")
    setConfirmPassword("")
    setNewSalesEmail("")
    setError("")
    setIsDialogOpen(true)
  }

  const saveReferences = (newReferences: Reference[]) => {
    setReferences(newReferences)
    localStorage.setItem("tpa-admin-references", JSON.stringify(newReferences))
    window.dispatchEvent(new CustomEvent("referencesUpdated"))
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUrl = (url: string) => {
    if (!url) return true // URL is optional
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === "https:"
    } catch {
      return false
    }
  }

  const validateWhatsApp = (whatsapp: string) => {
    const whatsappRegex = /^\+\d+$/
    return whatsappRegex.test(whatsapp)
  }

  const handleAddReference = () => {
    if (
      !newReference.name ||
      !newReference.position ||
      !newReference.company ||
      !newReference.email ||
      !newReference.whatsapp
    ) {
      setError("Todos los campos son obligatorios.")
      return
    }
    if (!validateEmail(newReference.email)) {
      setError("El formato del correo electrónico no es válido.")
      return
    }
    if (!validateWhatsApp(newReference.whatsapp)) {
      setError("El WhatsApp debe iniciar con + y contener solo números.")
      return
    }

    const newReferenceObj: Reference = {
      id: Date.now().toString(),
      ...newReference,
      createdAt: new Date().toISOString(),
    }

    const updatedReferences = [...references, newReferenceObj]
    saveReferences(updatedReferences)
    setNewReference({ name: "", position: "", company: "", email: "", whatsapp: "" })
    setError("")
    setIsReferenceDialogOpen(false)
  }

  const handleEditReference = () => {
    if (!editingReference) return
    if (
      !newReference.name ||
      !newReference.position ||
      !newReference.company ||
      !newReference.email ||
      !newReference.whatsapp
    ) {
      setError("Todos los campos son obligatorios.")
      return
    }
    if (!validateEmail(newReference.email)) {
      setError("El formato del correo electrónico no es válido.")
      return
    }
    if (!validateWhatsApp(newReference.whatsapp)) {
      setError("El WhatsApp debe iniciar con + y contener solo números.")
      return
    }

    const updatedReferences = references.map((r) => (r.id === editingReference.id ? { ...r, ...newReference } : r))
    saveReferences(updatedReferences)
    setEditingReference(null)
    setNewReference({ name: "", position: "", company: "", email: "", whatsapp: "" })
    setError("")
    setIsReferenceDialogOpen(false)
  }

  const handleDeleteReference = (id: string) => {
    const updatedReferences = references.filter((r) => r.id !== id)
    saveReferences(updatedReferences)
  }

  const openEditReferenceDialog = (reference: Reference) => {
    setEditingReference(reference)
    setNewReference({
      name: reference.name,
      position: reference.position,
      company: reference.company,
      email: reference.email,
      whatsapp: reference.whatsapp,
    })
    setIsReferenceDialogOpen(true)
  }

  const openAddReferenceDialog = () => {
    setEditingReference(null)
    setNewReference({ name: "", position: "", company: "", email: "", whatsapp: "" })
    setError("")
    setIsReferenceDialogOpen(true)
  }

  const saveVideoDemos = (newVideoDemos: VideoDemo[]) => {
    setVideoDemos(newVideoDemos)
    localStorage.setItem("tpa-admin-video-demos", JSON.stringify(newVideoDemos))
    window.dispatchEvent(new CustomEvent("videosUpdated"))
  }

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/
    return youtubeRegex.test(url)
  }

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    return match ? match[1] : null
  }

  const handleAddVideoDemo = () => {
    if (!newVideoDemo.title || !newVideoDemo.youtubeUrl) {
      setError("El título y la URL de YouTube son obligatorios.")
      return
    }
    if (newVideoDemo.title.length > 100) {
      setError("El título no puede exceder los 100 caracteres.")
      return
    }
    if (!validateYouTubeUrl(newVideoDemo.youtubeUrl)) {
      setError("La URL debe ser un enlace válido de YouTube.")
      return
    }

    const newVideoDemoObj: VideoDemo = {
      id: Date.now().toString(),
      ...newVideoDemo,
      createdAt: new Date().toISOString(),
    }

    const updatedVideoDemos = [...videoDemos, newVideoDemoObj]
    saveVideoDemos(updatedVideoDemos)
    setNewVideoDemo({ title: "", youtubeUrl: "", description: "" })
    setError("")
    setIsVideoDemoDialogOpen(false)
  }

  const handleEditVideoDemo = () => {
    if (!editingVideoDemo) return
    if (!newVideoDemo.title || !newVideoDemo.youtubeUrl) {
      setError("El título y la URL de YouTube son obligatorios.")
      return
    }
    if (newVideoDemo.title.length > 100) {
      setError("El título no puede exceder los 100 caracteres.")
      return
    }
    if (!validateYouTubeUrl(newVideoDemo.youtubeUrl)) {
      setError("La URL debe ser un enlace válido de YouTube.")
      return
    }

    const updatedVideoDemos = videoDemos.map((v) => (v.id === editingVideoDemo.id ? { ...v, ...newVideoDemo } : v))
    saveVideoDemos(updatedVideoDemos)
    setEditingVideoDemo(null)
    setNewVideoDemo({ title: "", youtubeUrl: "", description: "" })
    setError("")
    setIsVideoDemoDialogOpen(false)
  }

  const handleDeleteVideoDemo = (id: string) => {
    const updatedVideoDemos = videoDemos.filter((v) => v.id !== id)
    saveVideoDemos(updatedVideoDemos)
  }

  const openEditVideoDemoDialog = (videoDemo: VideoDemo) => {
    setEditingVideoDemo(videoDemo)
    setNewVideoDemo({
      title: videoDemo.title,
      youtubeUrl: videoDemo.youtubeUrl,
      description: videoDemo.description || "",
    })
    setIsVideoDemoDialogOpen(true)
  }

  const openAddVideoDemoDialog = () => {
    setEditingVideoDemo(null)
    setNewVideoDemo({ title: "", youtubeUrl: "", description: "" })
    setError("")
    setIsVideoDemoDialogOpen(true)
  }

  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials)
    localStorage.setItem("tpa-admin-testimonials", JSON.stringify(newTestimonials))
    window.dispatchEvent(new CustomEvent("testimonialsUpdated"))
  }

  const saveTestimonialStats = (newStats: TestimonialStats) => {
    setTestimonialStats(newStats)
    localStorage.setItem("tpa-admin-testimonial-stats", JSON.stringify(newStats))
    window.dispatchEvent(new CustomEvent("testimonialStatsUpdated"))
  }

  const handleAddTestimonial = () => {
    if (!newTestimonial.text.trim()) {
      setError("El texto del testimonio es obligatorio.")
      return
    }
    if (newTestimonial.linkedinUrl && !validateUrl(newTestimonial.linkedinUrl)) {
      setError("La URL de LinkedIn debe ser válida y comenzar con https://")
      return
    }

    const newTestimonialObj: Testimonial = {
      id: Date.now().toString(),
      text: newTestimonial.text,
      name: newTestimonial.name || undefined,
      position: newTestimonial.position || undefined,
      company: newTestimonial.company || undefined,
      avatar: newTestimonial.avatar || undefined,
      linkedinUrl: newTestimonial.linkedinUrl || undefined,
      createdAt: new Date().toISOString(),
    }

    const updatedTestimonials = [...testimonials, newTestimonialObj]
    saveTestimonials(updatedTestimonials)
    setNewTestimonial({ text: "", name: "", position: "", company: "", avatar: "", linkedinUrl: "" })
    setError("")
    setIsTestimonialDialogOpen(false)
  }

  const handleEditTestimonial = () => {
    if (!editingTestimonial) return
    if (!newTestimonial.text.trim()) {
      setError("El texto del testimonio es obligatorio.")
      return
    }
    if (newTestimonial.linkedinUrl && !validateUrl(newTestimonial.linkedinUrl)) {
      setError("La URL de LinkedIn debe ser válida y comenzar con https://")
      return
    }

    const updatedTestimonials = testimonials.map((t) =>
      t.id === editingTestimonial.id
        ? {
            ...t,
            text: newTestimonial.text,
            name: newTestimonial.name || undefined,
            position: newTestimonial.position || undefined,
            company: newTestimonial.company || undefined,
            avatar: newTestimonial.avatar || undefined,
            linkedinUrl: newTestimonial.linkedinUrl || undefined,
          }
        : t,
    )
    saveTestimonials(updatedTestimonials)
    setEditingTestimonial(null)
    setNewTestimonial({ text: "", name: "", position: "", company: "", avatar: "", linkedinUrl: "" })
    setError("")
    setIsTestimonialDialogOpen(false)
  }

  const handleDeleteTestimonial = (id: string) => {
    const updatedTestimonials = testimonials.filter((t) => t.id !== id)
    saveTestimonials(updatedTestimonials)
  }

  const openEditTestimonialDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setNewTestimonial({
      text: testimonial.text,
      name: testimonial.name || "",
      position: testimonial.position || "",
      company: testimonial.company || "",
      avatar: testimonial.avatar || "",
      linkedinUrl: testimonial.linkedinUrl || "",
    })
    setIsTestimonialDialogOpen(true)
  }

  const openAddTestimonialDialog = () => {
    setEditingTestimonial(null)
    setNewTestimonial({ text: "", name: "", position: "", company: "", avatar: "", linkedinUrl: "" })
    setError("")
    setIsTestimonialDialogOpen(true)
  }

  const saveCustomizationContent = (newContent: CustomizationContent) => {
    setCustomizationContent(newContent)
    localStorage.setItem("tpa-admin-customization-content", JSON.stringify(newContent))
    window.dispatchEvent(new CustomEvent("customizationUpdated"))
  }

  const handleAddCustomizationItem = () => {
    if (!newCustomizationItem.name.trim()) {
      setError("El nombre del ítem es obligatorio.")
      return
    }

    const newItem = {
      id: Date.now().toString(),
      name: newCustomizationItem.name,
      description: newCustomizationItem.description || undefined,
    }

    const updatedContent = { ...customizationContent }

    switch (editingCustomizationSection) {
      case "core":
        updatedContent.coreModules = [...updatedContent.coreModules, newItem]
        break
      case "customizable":
        updatedContent.customizableModules = [...updatedContent.customizableModules, newItem]
        break
      case "additional":
        updatedContent.additionalOptions = [...updatedContent.additionalOptions, newItem]
        break
    }

    saveCustomizationContent(updatedContent)
    setNewCustomizationItem({ name: "", description: "" })
    setError("")
    setIsCustomizationDialogOpen(false)
    setEditingCustomizationSection(null)
  }

  const handleEditCustomizationItem = () => {
    if (!editingCustomizationItem) return
    if (!newCustomizationItem.name.trim()) {
      setError("El nombre del ítem es obligatorio.")
      return
    }

    const updatedContent = { ...customizationContent }

    switch (editingCustomizationSection) {
      case "core":
        updatedContent.coreModules = updatedContent.coreModules.map((item) =>
          item.id === editingCustomizationItem.id
            ? { ...item, name: newCustomizationItem.name, description: newCustomizationItem.description }
            : item,
        )
        break
      case "customizable":
        updatedContent.customizableModules = updatedContent.customizableModules.map((item) =>
          item.id === editingCustomizationItem.id
            ? { ...item, name: newCustomizationItem.name, description: newCustomizationItem.description }
            : item,
        )
        break
      case "additional":
        updatedContent.additionalOptions = updatedContent.additionalOptions.map((item) =>
          item.id === editingCustomizationItem.id
            ? { ...item, name: newCustomizationItem.name, description: newCustomizationItem.description }
            : item,
        )
        break
    }

    saveCustomizationContent(updatedContent)
    setEditingCustomizationItem(null)
    setNewCustomizationItem({ name: "", description: "" })
    setError("")
    setIsCustomizationDialogOpen(false)
    setEditingCustomizationSection(null)
  }

  const handleDeleteCustomizationItem = (section: "core" | "customizable" | "additional", id: string) => {
    const updatedContent = { ...customizationContent }

    switch (section) {
      case "core":
        updatedContent.coreModules = updatedContent.coreModules.filter((item) => item.id !== id)
        break
      case "customizable":
        updatedContent.customizableModules = updatedContent.customizableModules.filter((item) => item.id !== id)
        break
      case "additional":
        updatedContent.additionalOptions = updatedContent.additionalOptions.filter((item) => item.id !== id)
        break
    }

    saveCustomizationContent(updatedContent)
  }

  const openAddCustomizationDialog = (section: "core" | "customizable" | "additional") => {
    setEditingCustomizationSection(section)
    setEditingCustomizationItem(null)
    setNewCustomizationItem({ name: "", description: "" })
    setError("")
    setIsCustomizationDialogOpen(true)
  }

  const openEditCustomizationDialog = (
    section: "core" | "customizable" | "additional",
    item: { id: string; name: string; description?: string },
  ) => {
    setEditingCustomizationSection(section)
    setEditingCustomizationItem(item)
    setNewCustomizationItem({ name: item.name, description: item.description || "" })
    setError("")
    setIsCustomizationDialogOpen(true)
  }

  // Tracking functions
  const getSessionsByPassword = (password: string) => {
    return sessions.filter((session) => session.password === password)
  }

  const getPasswordStats = (password: string) => {
    const passwordSessions = getSessionsByPassword(password)
    const totalSessions = passwordSessions.length
    const lastAccess = passwordSessions.length > 0 ? passwordSessions[passwordSessions.length - 1].startTime : null
    const avgDuration =
      passwordSessions.length > 0
        ? Math.round(
            passwordSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / passwordSessions.length,
          )
        : 0

    const allSections = passwordSessions.flatMap((session) => session.sectionsVisited)
    const sectionCounts = allSections.reduce(
      (acc, section) => {
        acc[section] = (acc[section] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const mostVisitedSection = Object.entries(sectionCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

    return {
      totalSessions,
      lastAccess,
      avgDuration,
      mostVisitedSection,
    }
  }

  const maskPassword = (password: string) => {
    if (password.length <= 3) return password
    return "*".repeat(password.length - 3) + password.slice(-3)
  }

  const viewPasswordSessions = (password: string) => {
    const passwordSessions = getSessionsByPassword(password).sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )
    setSelectedPasswordSessions(passwordSessions)
    setSelectedPasswordForSessions(password)
    setIsSessionsDialogOpen(true)
  }

  const exportData = () => {
    const data = {
      passwords,
      sessions,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tpa-tracking-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <LockIcon className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Panel de Administración</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Acceso Administrativo</CardTitle>
            <CardDescription className="text-gray-600">
              Ingrese la contraseña maestra para gestionar contraseñas y ver métricas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Contraseña maestra"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  className="w-full"
                  required
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
              </div>
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-slate-800 rounded-lg flex items-center justify-center font-bold">
                3C
              </div>
              <div>
                <div className="font-semibold">The Prompt Academy</div>
                <div className="text-sm text-gray-300">Panel de Administración</div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("passwords")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "passwords"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Gestión de Contraseñas
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "tracking"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart3Icon className="h-4 w-4 inline mr-2" />
              Tracking de Sesiones
            </button>
            <button
              onClick={() => setActiveTab("referencias")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "referencias"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UsersIcon className="h-4 w-4 inline mr-2" />
              Gestión de Referencias
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "videos"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <PlayCircleIcon className="h-4 w-4 inline mr-2" />
              Gestión de Videos Demo
            </button>
            <button
              onClick={() => setActiveTab("testimonios")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "testimonios"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MessageSquareIcon className="h-4 w-4 inline mr-2" />
              Gestión de Testimonios
            </button>
            <button
              onClick={() => setActiveTab("personalizacion")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "personalizacion"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <SettingsIcon className="h-4 w-4 inline mr-2" />
              Gestión de Personalización
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === "passwords" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestión de Contraseñas</h1>
                <p className="text-gray-600 mt-2">Administra las contraseñas de acceso al área privada</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog} className="bg-orange-600 hover:bg-orange-700">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Contraseña
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingPassword ? "Editar Contraseña" : "Agregar Nueva Contraseña"}</DialogTitle>
                    <DialogDescription>
                      {editingPassword ? "Modifica la contraseña existente" : "Crea una nueva contraseña de acceso"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contraseña</label>
                      <Input
                        type="text"
                        placeholder="Ingrese la contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirmar Contraseña</label>
                      <Input
                        type="text"
                        placeholder="Confirme la contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo del Asesor de Ventas</label>
                      <Input
                        type="email"
                        placeholder="asesor@thepromptacademy.com"
                        value={newSalesEmail}
                        onChange={(e) => setNewSalesEmail(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingPassword ? handleEditPassword : handleAddPassword}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {editingPassword ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Passwords List */}
            <Card>
              <CardHeader>
                <CardTitle>Contraseñas Activas ({passwords.length})</CardTitle>
                <CardDescription>Lista de todas las contraseñas válidas para acceder al área privada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passwords.map((password) => (
                    <div key={password.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-mono text-lg font-semibold text-slate-800">{password.password}</div>
                        <div className="text-sm text-gray-600">Asesor: {password.salesEmail}</div>
                        <div className="text-sm text-gray-500">
                          Creada: {new Date(password.createdAt).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(password)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePassword(password.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {passwords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay contraseñas configuradas</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "tracking" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Tracking de Sesiones</h1>
              <p className="text-gray-600 mt-2">Métricas de uso y actividad por contraseña</p>
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{sessions.length}</div>
                  <div className="text-gray-600">Total Sesiones</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {sessions.filter((s) => s.isActive).length}
                  </div>
                  <div className="text-gray-600">Sesiones Activas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.round(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length) || 0}
                  </div>
                  <div className="text-gray-600">Duración Promedio (min)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {new Set(sessions.map((s) => s.password)).size}
                  </div>
                  <div className="text-gray-600">Contraseñas Usadas</div>
                </CardContent>
              </Card>
            </div>

            {/* Sessions by Password */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad por Contraseña</CardTitle>
                <CardDescription>Resumen de sesiones y métricas por cada contraseña</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Contraseña</th>
                        <th className="text-center py-3 px-4 font-semibold">N° Sesiones</th>
                        <th className="text-center py-3 px-4 font-semibold">Último Acceso</th>
                        <th className="text-center py-3 px-4 font-semibold">Duración Promedio</th>
                        <th className="text-center py-3 px-4 font-semibold">Sección Más Visitada</th>
                        <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passwords.map((password) => {
                        const stats = getPasswordStats(password.password)
                        return (
                          <tr key={password.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 font-mono">{password.password}</td>
                            <td className="py-4 px-4 text-center font-semibold">{stats.totalSessions}</td>
                            <td className="py-4 px-4 text-center text-sm">
                              {stats.lastAccess
                                ? new Date(stats.lastAccess).toLocaleDateString("es-ES") +
                                  " " +
                                  new Date(stats.lastAccess).toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Nunca"}
                            </td>
                            <td className="py-4 px-4 text-center">{stats.avgDuration} min</td>
                            <td className="py-4 px-4 text-center text-sm">{stats.mostVisitedSection}</td>
                            <td className="py-4 px-4 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewPasswordSessions(password.password)}
                                disabled={stats.totalSessions === 0}
                              >
                                <EyeIcon className="h-4 w-4 mr-1" />
                                Ver sesiones
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Sessions Detail Dialog */}
            <Dialog open={isSessionsDialogOpen} onOpenChange={setIsSessionsDialogOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Sesiones de {maskPassword(selectedPasswordForSessions)}</DialogTitle>
                  <DialogDescription>Detalle de todas las sesiones registradas para esta contraseña</DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold">Fecha de Inicio</th>
                        <th className="text-center py-2 px-3 font-semibold">Duración (min)</th>
                        <th className="text-left py-2 px-3 font-semibold">Secciones Visitadas</th>
                        <th className="text-center py-2 px-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPasswordSessions.map((session) => (
                        <tr key={session.id} className="border-b border-gray-100">
                          <td className="py-3 px-3 text-sm">
                            {new Date(session.startTime).toLocaleDateString("es-ES")} <br />
                            <span className="text-gray-500">
                              {new Date(session.startTime).toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">{session.duration || 0}</td>
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1">
                              {session.sectionsVisited.map((section, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
                                >
                                  {section}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs ${
                                session.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {session.isActive ? "Activa" : "Finalizada"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedPasswordSessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay sesiones registradas</div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
        {activeTab === "referencias" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestión de Referencias</h1>
                <p className="text-gray-600 mt-2">Administra las referencias institucionales visibles en el sitio</p>
              </div>
              <Dialog open={isReferenceDialogOpen} onOpenChange={setIsReferenceDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddReferenceDialog} className="bg-orange-600 hover:bg-orange-700">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Referencia
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingReference ? "Editar Referencia" : "Agregar Nueva Referencia"}</DialogTitle>
                    <DialogDescription>
                      {editingReference
                        ? "Modifica los datos de la referencia"
                        : "Completa la información de la nueva referencia"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre completo</label>
                      <Input
                        type="text"
                        placeholder="Ej: María González"
                        value={newReference.name}
                        onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cargo</label>
                      <Input
                        type="text"
                        placeholder="Ej: Directora de Innovación"
                        value={newReference.position}
                        onChange={(e) => setNewReference({ ...newReference, position: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Empresa</label>
                      <Input
                        type="text"
                        placeholder="Ej: Banco Santander Chile"
                        value={newReference.company}
                        onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo electrónico</label>
                      <Input
                        type="email"
                        placeholder="Ej: maria.gonzalez@empresa.cl"
                        value={newReference.email}
                        onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">WhatsApp</label>
                      <Input
                        type="text"
                        placeholder="Ej: +56912345678"
                        value={newReference.whatsapp}
                        onChange={(e) => setNewReference({ ...newReference, whatsapp: e.target.value })}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingReference ? handleEditReference : handleAddReference}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {editingReference ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsReferenceDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* References List */}
            <Card>
              <CardHeader>
                <CardTitle>Referencias Activas ({references.length})</CardTitle>
                <CardDescription>Lista de todas las referencias institucionales visibles en el sitio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                        <th className="text-left py-3 px-4 font-semibold">Cargo</th>
                        <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                        <th className="text-left py-3 px-4 font-semibold">Correo</th>
                        <th className="text-left py-3 px-4 font-semibold">WhatsApp</th>
                        <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {references.map((reference) => (
                        <tr key={reference.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-slate-800">{reference.name}</td>
                          <td className="py-4 px-4 text-gray-600">{reference.position}</td>
                          <td className="py-4 px-4 text-gray-600">{reference.company}</td>
                          <td className="py-4 px-4 text-gray-600 font-mono text-sm">{reference.email}</td>
                          <td className="py-4 px-4 text-gray-600 font-mono text-sm">{reference.whatsapp}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button variant="outline" size="sm" onClick={() => openEditReferenceDialog(reference)}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteReference(reference.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {references.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay referencias configuradas</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {activeTab === "videos" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestión de Videos Demo</h1>
                <p className="text-gray-600 mt-2">Administra los videos de demostración del curso</p>
              </div>
              <Dialog open={isVideoDemoDialogOpen} onOpenChange={setIsVideoDemoDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddVideoDemoDialog} className="bg-orange-600 hover:bg-orange-700">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Video Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingVideoDemo ? "Editar Video Demo" : "Agregar Nuevo Video Demo"}</DialogTitle>
                    <DialogDescription>
                      {editingVideoDemo
                        ? "Modifica los datos del video demo"
                        : "Completa la información del nuevo video demo"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título del video (máx. 100 caracteres)</label>
                      <Input
                        type="text"
                        placeholder="Ej: Fundamentos de IA Generativa"
                        value={newVideoDemo.title}
                        onChange={(e) => setNewVideoDemo({ ...newVideoDemo, title: e.target.value })}
                        maxLength={100}
                      />
                      <div className="text-xs text-gray-500">{newVideoDemo.title.length}/100 caracteres</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL de YouTube</label>
                      <Input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={newVideoDemo.youtubeUrl}
                        onChange={(e) => setNewVideoDemo({ ...newVideoDemo, youtubeUrl: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descripción (opcional)</label>
                      <Input
                        type="text"
                        placeholder="Descripción breve del contenido del video"
                        value={newVideoDemo.description}
                        onChange={(e) => setNewVideoDemo({ ...newVideoDemo, description: e.target.value })}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingVideoDemo ? handleEditVideoDemo : handleAddVideoDemo}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {editingVideoDemo ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsVideoDemoDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Videos List */}
            <Card>
              <CardHeader>
                <CardTitle>Videos Demo Activos ({videoDemos.length})</CardTitle>
                <CardDescription>Lista de todos los videos de demostración del curso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Título</th>
                        <th className="text-left py-3 px-4 font-semibold">URL de YouTube</th>
                        <th className="text-left py-3 px-4 font-semibold">Descripción</th>
                        <th className="text-center py-3 px-4 font-semibold">Preview</th>
                        <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoDemos.map((video) => (
                        <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-slate-800">{video.title}</td>
                          <td className="py-4 px-4 text-gray-600 font-mono text-sm max-w-xs truncate">
                            {video.youtubeUrl}
                          </td>
                          <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                            {video.description || "Sin descripción"}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {extractVideoId(video.youtubeUrl) && (
                              <img
                                src={`https://img.youtube.com/vi/${extractVideoId(video.youtubeUrl)}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-16 h-12 object-cover rounded mx-auto"
                              />
                            )}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button variant="outline" size="sm" onClick={() => openEditVideoDemoDialog(video)}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteVideoDemo(video.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {videoDemos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay videos demo configurados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {activeTab === "testimonios" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Gestión de Testimonios</h1>
              <p className="text-gray-600 mt-2">Administra los testimonios y estadísticas de la sección pública</p>
            </div>

            {/* Estadísticas */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Estadísticas de Impacto</CardTitle>
                <CardDescription>Métricas que se muestran en la sección pública</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Texto Introductorio */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-800">Texto introductorio:</h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <EditIcon className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Editar Texto Introductorio</DialogTitle>
                            <DialogDescription>
                              Modifica el texto que aparece arriba de los testimonios
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <textarea
                              className="w-full p-2 border rounded-md"
                              rows={4}
                              value={testimonialStats.introText}
                              onChange={(e) => setTestimonialStats({ ...testimonialStats, introText: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => saveTestimonialStats(testimonialStats)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                Guardar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-gray-600 text-sm">{testimonialStats.introText}</p>
                  </div>

                  {/* Estadísticas Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Profesionales Capacitados */}
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Profesionales capacitados</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <EditIcon className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Editar Profesionales Capacitados</DialogTitle>
                              <DialogDescription>
                                Ingresa solo el número (el símbolo + se agrega automáticamente)
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Input
                                type="number"
                                value={testimonialStats.totalProfessionals}
                                onChange={(e) =>
                                  setTestimonialStats({
                                    ...testimonialStats,
                                    totalProfessionals: Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                              <Button
                                onClick={() => saveTestimonialStats(testimonialStats)}
                                className="w-full bg-orange-600 hover:bg-orange-700"
                              >
                                Guardar
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {testimonialStats.totalProfessionals}+
                      </div>
                    </div>

                    {/* Satisfacción Promedio */}
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Satisfacción promedio</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <EditIcon className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Editar Satisfacción Promedio</DialogTitle>
                              <DialogDescription>Ingresa el porcentaje (sin el símbolo %)</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Input
                                type="number"
                                value={testimonialStats.satisfactionRate}
                                onChange={(e) =>
                                  setTestimonialStats({
                                    ...testimonialStats,
                                    satisfactionRate: Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                              <Button
                                onClick={() => saveTestimonialStats(testimonialStats)}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                Guardar
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">{testimonialStats.satisfactionRate}%</div>
                    </div>

                    {/* Aumento en Productividad */}
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Aumento en productividad</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <EditIcon className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader>
                              <DialogTitle>Editar Aumento en Productividad</DialogTitle>
                              <DialogDescription>Ingresa el porcentaje (sin el símbolo %)</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Input
                                type="number"
                                value={testimonialStats.productivityIncrease}
                                onChange={(e) =>
                                  setTestimonialStats({
                                    ...testimonialStats,
                                    productivityIncrease: Number.parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                              <Button
                                onClick={() => saveTestimonialStats(testimonialStats)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                              >
                                Guardar
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {testimonialStats.productivityIncrease}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonios */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Testimonios</h2>
                <p className="text-gray-600 mt-1">Gestiona los testimonios individuales</p>
              </div>
              <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddTestimonialDialog} className="bg-orange-600 hover:bg-orange-700">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Testimonio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingTestimonial ? "Editar Testimonio" : "Agregar Nuevo Testimonio"}</DialogTitle>
                    <DialogDescription>
                      {editingTestimonial
                        ? "Modifica los datos del testimonio"
                        : "Completa la información del nuevo testimonio"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Texto del testimonio *</label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={4}
                        placeholder="Escribe el testimonio completo..."
                        value={newTestimonial.text}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre (opcional)</label>
                        <Input
                          type="text"
                          placeholder="Ej: María González"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cargo (opcional)</label>
                        <Input
                          type="text"
                          placeholder="Ej: Directora de Innovación"
                          value={newTestimonial.position}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Empresa (opcional)</label>
                      <Input
                        type="text"
                        placeholder="Ej: Banco Santander Chile"
                        value={newTestimonial.company}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL del avatar (opcional)</label>
                      <Input
                        type="url"
                        placeholder="https://ejemplo.com/avatar.jpg"
                        value={newTestimonial.avatar}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, avatar: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL de LinkedIn (opcional)</label>
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/usuario"
                        value={newTestimonial.linkedinUrl}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, linkedinUrl: e.target.value })}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingTestimonial ? handleEditTestimonial : handleAddTestimonial}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {editingTestimonial ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsTestimonialDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Testimonios Activos ({testimonials.length})</CardTitle>
                <CardDescription>Lista de todos los testimonios visibles en el sitio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold">Nombre</th>
                        <th className="text-left py-3 px-4 font-semibold">Cargo y Empresa</th>
                        <th className="text-left py-3 px-4 font-semibold">Fragmento del Testimonio</th>
                        <th className="text-center py-3 px-4 font-semibold">LinkedIn</th>
                        <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-slate-800">{testimonial.name || "Anónimo"}</td>
                          <td className="py-4 px-4 text-gray-600">
                            {testimonial.position && testimonial.company
                              ? `${testimonial.position}, ${testimonial.company}`
                              : testimonial.position || testimonial.company || "No especificado"}
                          </td>
                          <td className="py-4 px-4 text-gray-600 max-w-xs">
                            <div className="truncate">
                              {testimonial.text.length > 80
                                ? `${testimonial.text.substring(0, 80)}...`
                                : testimonial.text}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {testimonial.linkedinUrl ? (
                              <div className="flex items-center justify-center">
                                <LinkedinIcon className="h-4 w-4 text-blue-600" />
                                <span className="ml-1 text-sm text-blue-600">Activo</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditTestimonialDialog(testimonial)}
                              >
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {testimonials.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay testimonios configurados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {activeTab === "personalizacion" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Gestión de Personalización</h1>
              <p className="text-gray-600 mt-2">Administra el contenido de la sección de personalización del curso</p>
            </div>

            {/* Texto Introductorio */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Texto Introductorio</CardTitle>
                <CardDescription>Párrafo que aparece debajo del título de la sección</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    value={customizationContent.introText}
                    onChange={(e) => setCustomizationContent({ ...customizationContent, introText: e.target.value })}
                  />
                  <Button
                    onClick={() => saveCustomizationContent(customizationContent)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Guardar Texto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Módulos Core */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Módulos Core</CardTitle>
                    <CardDescription>Módulos que siempre están incluidos en el curso</CardDescription>
                  </div>
                  <Button
                    onClick={() => openAddCustomizationDialog("core")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Módulo Core
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customizationContent.coreModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{module.name}</div>
                        {module.description && <div className="text-sm text-gray-600 mt-1">{module.description}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditCustomizationDialog("core", module)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomizationItem("core", module.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {customizationContent.coreModules.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay módulos core configurados</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Módulos Personalizables */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Módulos Personalizables</CardTitle>
                    <CardDescription>Módulos opcionales según el perfil del cliente</CardDescription>
                  </div>
                  <Button
                    onClick={() => openAddCustomizationDialog("customizable")}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Módulo Personalizable
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customizationContent.customizableModules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{module.name}</div>
                        {module.description && <div className="text-sm text-gray-600 mt-1">{module.description}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditCustomizationDialog("customizable", module)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomizationItem("customizable", module.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {customizationContent.customizableModules.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay módulos personalizables configurados</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Opciones Adicionales */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Opciones Adicionales</CardTitle>
                    <CardDescription>Servicios premium y opciones extra disponibles</CardDescription>
                  </div>
                  <Button
                    onClick={() => openAddCustomizationDialog("additional")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Opción Adicional
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customizationContent.additionalOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{option.name}</div>
                        {option.description && <div className="text-sm text-gray-600 mt-1">{option.description}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditCustomizationDialog("additional", option)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomizationItem("additional", option.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {customizationContent.additionalOptions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay opciones adicionales configuradas</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dialog para agregar/editar items */}
            <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingCustomizationItem ? "Editar Ítem" : "Agregar Nuevo Ítem"}
                    {editingCustomizationSection === "core" && " - Módulo Core"}
                    {editingCustomizationSection === "customizable" && " - Módulo Personalizable"}
                    {editingCustomizationSection === "additional" && " - Opción Adicional"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCustomizationItem
                      ? "Modifica la información del ítem"
                      : "Completa la información del nuevo ítem"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre *</label>
                    <Input
                      type="text"
                      placeholder="Ej: Fundamentos de IA Generativa"
                      value={newCustomizationItem.name}
                      onChange={(e) => setNewCustomizationItem({ ...newCustomizationItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descripción (opcional)</label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Descripción breve del contenido..."
                      value={newCustomizationItem.description}
                      onChange={(e) =>
                        setNewCustomizationItem({ ...newCustomizationItem, description: e.target.value })
                      }
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <div className="flex gap-2">
                    <Button
                      onClick={editingCustomizationItem ? handleEditCustomizationItem : handleAddCustomizationItem}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {editingCustomizationItem ? "Actualizar" : "Agregar"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <TrackingProvider>
      <AdminContent />
    </TrackingProvider>
  )
}
