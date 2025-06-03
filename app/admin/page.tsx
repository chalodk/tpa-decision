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
  BarChart3Icon,
  UsersIcon,
  PlayCircleIcon,
  MessageSquareIcon,
  SettingsIcon,
  AlertCircleIcon,
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
import {
  getPasswords,
  createPassword,
  updatePassword,
  deletePassword,
  getReferences,
  createReference,
  updateReference,
  deleteReference,
  getVideoDemos,
  createVideoDemo,
  updateVideoDemo,
  deleteVideoDemo,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialStats,
  updateTestimonialStats,
  getSessions,
  getSessionsByPassword,
  getCustomizationContent,
  updateCustomizationContent,
  initializeDatabase,
} from "@/lib/database"
import type { Password, Reference, VideoDemo, Testimonial, TestimonialStats, Session } from "@/lib/supabase"

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
  const [loading, setLoading] = useState(false)
  const [dbConnected, setDbConnected] = useState(false)
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
    youtube_url: "",
    description: "",
  })
  const [editingVideoDemo, setEditingVideoDemo] = useState<VideoDemo | null>(null)
  const [isVideoDemoDialogOpen, setIsVideoDemoDialogOpen] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [testimonialStats, setTestimonialStats] = useState<TestimonialStats | null>(null)
  const [newTestimonial, setNewTestimonial] = useState({
    text: "",
    name: "",
    position: "",
    company: "",
    avatar: "",
    linkedin_url: "",
  })
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false)
  const [customizationContent, setCustomizationContent] = useState<CustomizationContent>({
    introText: "",
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

  // Initialize database connection and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
        const connected = await initializeDatabase()
        setDbConnected(connected)

        if (connected) {
          await loadAllData()
        } else {
          console.warn("Database not connected, using fallback mode")
        }
      } catch (error) {
        console.error("Error initializing app:", error)
        setError("Error al conectar con la base de datos")
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const loadAllData = async () => {
    try {
      // Load all data from Supabase
      const [
        passwordsData,
        referencesData,
        videoDemosData,
        testimonialsData,
        statsData,
        sessionsData,
        customizationData,
      ] = await Promise.all([
        getPasswords(),
        getReferences(),
        getVideoDemos(),
        getTestimonials(),
        getTestimonialStats(),
        getSessions(),
        getCustomizationContent(),
      ])

      setPasswords(passwordsData)
      setReferences(referencesData)
      setVideoDemos(videoDemosData)
      setTestimonials(testimonialsData)
      setTestimonialStats(statsData)
      setSessions(sessionsData)

      if (customizationData) {
        setCustomizationContent({
          introText: customizationData.intro_text || "",
          coreModules: customizationData.core_modules || [],
          customizableModules: customizationData.customizable_modules || [],
          additionalOptions: customizationData.additional_options || [],
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Error al cargar datos de la base de datos")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (masterPassword === MASTER_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Contraseña maestra incorrecta.")
    }
  }

  // Password management functions
  const handleAddPassword = async () => {
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

    try {
      setLoading(true)
      const newPasswordData = {
        password: newPassword,
        sales_email: newSalesEmail,
      }

      const createdPassword = await createPassword(newPasswordData)
      setPasswords((prev) => [createdPassword, ...prev])
      setNewPassword("")
      setConfirmPassword("")
      setNewSalesEmail("")
      setError("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating password:", error)
      setError("Error al crear la contraseña")
    } finally {
      setLoading(false)
    }
  }

  const handleEditPassword = async () => {
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

    try {
      setLoading(true)
      const updatedPassword = await updatePassword(editingPassword.id, {
        password: newPassword,
        sales_email: newSalesEmail,
      })

      setPasswords((prev) => prev.map((p) => (p.id === editingPassword.id ? updatedPassword : p)))
      setEditingPassword(null)
      setNewPassword("")
      setConfirmPassword("")
      setNewSalesEmail("")
      setError("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating password:", error)
      setError("Error al actualizar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePassword = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta contraseña?")) return

    try {
      setLoading(true)
      await deletePassword(id)
      setPasswords((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting password:", error)
      setError("Error al eliminar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  // Reference management functions
  const handleAddReference = async () => {
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

    try {
      setLoading(true)
      const createdReference = await createReference(newReference)
      setReferences((prev) => [createdReference, ...prev])
      setNewReference({ name: "", position: "", company: "", email: "", whatsapp: "" })
      setError("")
      setIsReferenceDialogOpen(false)
    } catch (error) {
      console.error("Error creating reference:", error)
      setError("Error al crear la referencia")
    } finally {
      setLoading(false)
    }
  }

  const handleEditReference = async () => {
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

    try {
      setLoading(true)
      const updatedReference = await updateReference(editingReference.id, newReference)
      setReferences((prev) => prev.map((r) => (r.id === editingReference.id ? updatedReference : r)))
      setEditingReference(null)
      setNewReference({ name: "", position: "", company: "", email: "", whatsapp: "" })
      setError("")
      setIsReferenceDialogOpen(false)
    } catch (error) {
      console.error("Error updating reference:", error)
      setError("Error al actualizar la referencia")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReference = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta referencia?")) return

    try {
      setLoading(true)
      await deleteReference(id)
      setReferences((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error("Error deleting reference:", error)
      setError("Error al eliminar la referencia")
    } finally {
      setLoading(false)
    }
  }

  // Video Demo management functions
  const handleAddVideoDemo = async () => {
    if (!newVideoDemo.title || !newVideoDemo.youtube_url) {
      setError("El título y la URL de YouTube son obligatorios.")
      return
    }
    if (newVideoDemo.title.length > 100) {
      setError("El título no puede exceder los 100 caracteres.")
      return
    }
    if (!validateYouTubeUrl(newVideoDemo.youtube_url)) {
      setError("La URL debe ser un enlace válido de YouTube.")
      return
    }

    try {
      setLoading(true)
      const createdVideoDemo = await createVideoDemo(newVideoDemo)
      setVideoDemos((prev) => [createdVideoDemo, ...prev])
      setNewVideoDemo({ title: "", youtube_url: "", description: "" })
      setError("")
      setIsVideoDemoDialogOpen(false)
    } catch (error) {
      console.error("Error creating video demo:", error)
      setError("Error al crear el video demo")
    } finally {
      setLoading(false)
    }
  }

  const handleEditVideoDemo = async () => {
    if (!editingVideoDemo) return
    if (!newVideoDemo.title || !newVideoDemo.youtube_url) {
      setError("El título y la URL de YouTube son obligatorios.")
      return
    }
    if (newVideoDemo.title.length > 100) {
      setError("El título no puede exceder los 100 caracteres.")
      return
    }
    if (!validateYouTubeUrl(newVideoDemo.youtube_url)) {
      setError("La URL debe ser un enlace válido de YouTube.")
      return
    }

    try {
      setLoading(true)
      const updatedVideoDemo = await updateVideoDemo(editingVideoDemo.id, newVideoDemo)
      setVideoDemos((prev) => prev.map((v) => (v.id === editingVideoDemo.id ? updatedVideoDemo : v)))
      setEditingVideoDemo(null)
      setNewVideoDemo({ title: "", youtube_url: "", description: "" })
      setError("")
      setIsVideoDemoDialogOpen(false)
    } catch (error) {
      console.error("Error updating video demo:", error)
      setError("Error al actualizar el video demo")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideoDemo = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este video demo?")) return

    try {
      setLoading(true)
      await deleteVideoDemo(id)
      setVideoDemos((prev) => prev.filter((v) => v.id !== id))
    } catch (error) {
      console.error("Error deleting video demo:", error)
      setError("Error al eliminar el video demo")
    } finally {
      setLoading(false)
    }
  }

  // Testimonial management functions
  const handleAddTestimonial = async () => {
    if (!newTestimonial.text.trim()) {
      setError("El texto del testimonio es obligatorio.")
      return
    }
    if (newTestimonial.linkedin_url && !validateUrl(newTestimonial.linkedin_url)) {
      setError("La URL de LinkedIn debe ser válida y comenzar con https://")
      return
    }

    try {
      setLoading(true)
      const testimonialData = {
        text: newTestimonial.text,
        name: newTestimonial.name || undefined,
        position: newTestimonial.position || undefined,
        company: newTestimonial.company || undefined,
        avatar: newTestimonial.avatar || undefined,
        linkedin_url: newTestimonial.linkedin_url || undefined,
      }

      const createdTestimonial = await createTestimonial(testimonialData)
      setTestimonials((prev) => [createdTestimonial, ...prev])
      setNewTestimonial({ text: "", name: "", position: "", company: "", avatar: "", linkedin_url: "" })
      setError("")
      setIsTestimonialDialogOpen(false)
    } catch (error) {
      console.error("Error creating testimonial:", error)
      setError("Error al crear el testimonio")
    } finally {
      setLoading(false)
    }
  }

  const handleEditTestimonial = async () => {
    if (!editingTestimonial) return
    if (!newTestimonial.text.trim()) {
      setError("El texto del testimonio es obligatorio.")
      return
    }
    if (newTestimonial.linkedin_url && !validateUrl(newTestimonial.linkedin_url)) {
      setError("La URL de LinkedIn debe ser válida y comenzar con https://")
      return
    }

    try {
      setLoading(true)
      const testimonialData = {
        text: newTestimonial.text,
        name: newTestimonial.name || undefined,
        position: newTestimonial.position || undefined,
        company: newTestimonial.company || undefined,
        avatar: newTestimonial.avatar || undefined,
        linkedin_url: newTestimonial.linkedin_url || undefined,
      }

      const updatedTestimonial = await updateTestimonial(editingTestimonial.id, testimonialData)
      setTestimonials((prev) => prev.map((t) => (t.id === editingTestimonial.id ? updatedTestimonial : t)))
      setEditingTestimonial(null)
      setNewTestimonial({ text: "", name: "", position: "", company: "", avatar: "", linkedin_url: "" })
      setError("")
      setIsTestimonialDialogOpen(false)
    } catch (error) {
      console.error("Error updating testimonial:", error)
      setError("Error al actualizar el testimonio")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este testimonio?")) return

    try {
      setLoading(true)
      await deleteTestimonial(id)
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      setError("Error al eliminar el testimonio")
    } finally {
      setLoading(false)
    }
  }

  // Testimonial Stats management
  const handleUpdateTestimonialStats = async (newStats: Partial<TestimonialStats>) => {
    if (!testimonialStats) return

    try {
      setLoading(true)
      const updatedStats = await updateTestimonialStats({
        total_professionals: newStats.total_professionals ?? testimonialStats.total_professionals,
        satisfaction_rate: newStats.satisfaction_rate ?? testimonialStats.satisfaction_rate,
        productivity_increase: newStats.productivity_increase ?? testimonialStats.productivity_increase,
        intro_text: newStats.intro_text ?? testimonialStats.intro_text,
      })
      setTestimonialStats(updatedStats)
    } catch (error) {
      console.error("Error updating testimonial stats:", error)
      setError("Error al actualizar las estadísticas")
    } finally {
      setLoading(false)
    }
  }

  // Customization Content management
  const handleUpdateCustomizationContent = async (newContent: CustomizationContent) => {
    try {
      setLoading(true)
      const contentData = {
        intro_text: newContent.introText,
        core_modules: newContent.coreModules,
        customizable_modules: newContent.customizableModules,
        additional_options: newContent.additionalOptions,
      }

      await updateCustomizationContent(contentData)
      setCustomizationContent(newContent)
    } catch (error) {
      console.error("Error updating customization content:", error)
      setError("Error al actualizar el contenido de personalización")
    } finally {
      setLoading(false)
    }
  }

  // Utility functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUrl = (url: string) => {
    if (!url) return true
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

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/
    return youtubeRegex.test(url)
  }

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    return match ? match[1] : null
  }

  // Dialog handlers
  const openEditDialog = (password: Password) => {
    setEditingPassword(password)
    setNewPassword(password.password)
    setConfirmPassword(password.password)
    setNewSalesEmail(password.sales_email)
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

  const openEditVideoDemoDialog = (videoDemo: VideoDemo) => {
    setEditingVideoDemo(videoDemo)
    setNewVideoDemo({
      title: videoDemo.title,
      youtube_url: videoDemo.youtube_url,
      description: videoDemo.description || "",
    })
    setIsVideoDemoDialogOpen(true)
  }

  const openAddVideoDemoDialog = () => {
    setEditingVideoDemo(null)
    setNewVideoDemo({ title: "", youtube_url: "", description: "" })
    setError("")
    setIsVideoDemoDialogOpen(true)
  }

  const openEditTestimonialDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setNewTestimonial({
      text: testimonial.text,
      name: testimonial.name || "",
      position: testimonial.position || "",
      company: testimonial.company || "",
      avatar: testimonial.avatar || "",
      linkedin_url: testimonial.linkedin_url || "",
    })
    setIsTestimonialDialogOpen(true)
  }

  const openAddTestimonialDialog = () => {
    setEditingTestimonial(null)
    setNewTestimonial({ text: "", name: "", position: "", company: "", avatar: "", linkedin_url: "" })
    setError("")
    setIsTestimonialDialogOpen(true)
  }

  // Tracking functions
  const getSessionsByPasswordLocal = (password: string) => {
    return sessions.filter((session) => session.password === password)
  }

  const getPasswordStats = (password: string) => {
    const passwordSessions = getSessionsByPasswordLocal(password)
    const totalSessions = passwordSessions.length
    const lastAccess = passwordSessions.length > 0 ? passwordSessions[passwordSessions.length - 1].start_time : null
    const avgDuration =
      passwordSessions.length > 0
        ? Math.round(
            passwordSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / passwordSessions.length,
          )
        : 0

    const allSections = passwordSessions.flatMap((session) => session.sections_visited)
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

  const viewPasswordSessions = async (password: string) => {
    try {
      setLoading(true)
      const passwordSessions = await getSessionsByPassword(password)
      const sortedSessions = passwordSessions.sort(
        (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
      )
      setSelectedPasswordSessions(sortedSessions)
      setSelectedPasswordForSessions(password)
      setIsSessionsDialogOpen(true)
    } catch (error) {
      console.error("Error fetching sessions:", error)
      setError("Error al cargar las sesiones")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando panel de administración...</p>
          {!dbConnected && (
            <p className="text-orange-600 text-sm mt-2">
              <AlertCircleIcon className="h-4 w-4 inline mr-1" />
              Modo fallback - Sin conexión a Supabase
            </p>
          )}
        </div>
      </div>
    )
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
            {!dbConnected && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertCircleIcon className="h-4 w-4" />
                  <span className="text-sm">Modo fallback - Sin conexión a Supabase</span>
                </div>
              </div>
            )}
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
                <div className="text-sm text-gray-300">
                  Panel de Administración {dbConnected ? "- Conectado a Supabase" : "- Modo Fallback"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!dbConnected && (
                <div className="flex items-center gap-1 text-orange-300 text-sm">
                  <AlertCircleIcon className="h-4 w-4" />
                  Sin DB
                </div>
              )}
            </div>
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
        {/* Global Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircleIcon className="h-4 w-4" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError("")}
              className="mt-2 text-red-600 border-red-300"
            >
              Cerrar
            </Button>
          </div>
        )}

        {activeTab === "passwords" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestión de Contraseñas</h1>
                <p className="text-gray-600 mt-2">Administra las contraseñas de acceso al área privada</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog} className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
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
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirmar Contraseña</label>
                      <Input
                        type="text"
                        placeholder="Confirme la contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo del Asesor de Ventas</label>
                      <Input
                        type="email"
                        placeholder="asesor@thepromptacademy.com"
                        value={newSalesEmail}
                        onChange={(e) => setNewSalesEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingPassword ? handleEditPassword : handleAddPassword}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : editingPassword ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
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
                        <div className="text-sm text-gray-600">Asesor: {password.sales_email}</div>
                        <div className="text-sm text-gray-500">
                          Creada: {new Date(password.created_at).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(password)} disabled={loading}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePassword(password.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={loading}
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

        {/* Continue with other tabs... */}
        {/* I'll continue with the rest of the tabs in the next part */}
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
