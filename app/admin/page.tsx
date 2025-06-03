"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  EyeIcon,
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

        {/* Passwords Tab */}
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

        {/* Tracking Tab */}
        {activeTab === "tracking" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Tracking de Sesiones</h1>
              <p className="text-gray-600 mt-2">Monitorea el uso y actividad de cada contraseña</p>
            </div>

            {/* Sessions Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-slate-800">{sessions.length}</div>
                  <div className="text-gray-600">Total de Sesiones</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-slate-800">{sessions.filter((s) => s.is_active).length}</div>
                  <div className="text-gray-600">Sesiones Activas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-slate-800">{passwords.length}</div>
                  <div className="text-gray-600">Contraseñas Monitoreadas</div>
                </CardContent>
              </Card>
            </div>

            {/* Password Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis por Contraseña</CardTitle>
                <CardDescription>Estadísticas de uso para cada contraseña</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passwords.map((password) => {
                    const stats = getPasswordStats(password.password)
                    return (
                      <div key={password.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-mono text-lg font-semibold text-slate-800">
                              {maskPassword(password.password)}
                            </div>
                            <div className="text-sm text-gray-600">Asesor: {password.sales_email}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewPasswordSessions(password.password)}
                            disabled={loading}
                          >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            Ver Sesiones
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-700">Total Sesiones</div>
                            <div className="text-slate-800">{stats.totalSessions}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Último Acceso</div>
                            <div className="text-slate-800">
                              {stats.lastAccess ? new Date(stats.lastAccess).toLocaleDateString("es-ES") : "Nunca"}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Duración Promedio</div>
                            <div className="text-slate-800">{stats.avgDuration} min</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Sección Más Visitada</div>
                            <div className="text-slate-800">{stats.mostVisitedSection}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {passwords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay contraseñas para monitorear</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sessions Detail Dialog */}
            <Dialog open={isSessionsDialogOpen} onOpenChange={setIsSessionsDialogOpen}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Sesiones para contraseña: {maskPassword(selectedPasswordForSessions)}</DialogTitle>
                  <DialogDescription>Detalle de todas las sesiones registradas</DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {selectedPasswordSessions.map((session) => (
                      <div key={session.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium text-slate-800">Sesión {session.id.slice(-8)}</div>
                          <div
                            className={`px-2 py-1 rounded text-xs ${
                              session.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {session.is_active ? "Activa" : "Finalizada"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Inicio:</div>
                            <div>{new Date(session.start_time).toLocaleString("es-ES")}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Duración:</div>
                            <div>{session.duration ? `${session.duration} min` : "En curso"}</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-gray-600 text-sm">Secciones visitadas:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {session.sections_visited.map((section, index) => (
                              <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                                {section}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedPasswordSessions.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No hay sesiones registradas</div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* References Tab */}
        {activeTab === "referencias" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestión de Referencias</h1>
                <p className="text-gray-600 mt-2">Administra los contactos de referencia institucional</p>
              </div>
              <Dialog open={isReferenceDialogOpen} onOpenChange={setIsReferenceDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAddReferenceDialog}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={loading}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Referencia
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingReference ? "Editar Referencia" : "Agregar Nueva Referencia"}</DialogTitle>
                    <DialogDescription>
                      {editingReference
                        ? "Modifica la referencia existente"
                        : "Crea una nueva referencia institucional"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre Completo</label>
                        <Input
                          placeholder="María González"
                          value={newReference.name}
                          onChange={(e) => setNewReference({ ...newReference, name: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cargo</label>
                        <Input
                          placeholder="Directora de Innovación"
                          value={newReference.position}
                          onChange={(e) => setNewReference({ ...newReference, position: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Empresa</label>
                      <Input
                        placeholder="Banco Santander Chile"
                        value={newReference.company}
                        onChange={(e) => setNewReference({ ...newReference, company: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          placeholder="maria.gonzalez@empresa.com"
                          value={newReference.email}
                          onChange={(e) => setNewReference({ ...newReference, email: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp</label>
                        <Input
                          placeholder="+56912345678"
                          value={newReference.whatsapp}
                          onChange={(e) => setNewReference({ ...newReference, whatsapp: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingReference ? handleEditReference : handleAddReference}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : editingReference ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsReferenceDialogOpen(false)} disabled={loading}>
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
                <CardDescription>Lista de contactos de referencia disponibles para los usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {references.map((reference) => (
                    <div key={reference.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">{reference.name}</div>
                        <div className="text-sm text-gray-600">{reference.position}</div>
                        <div className="text-sm text-gray-600">{reference.company}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {reference.email} • {reference.whatsapp}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditReferenceDialog(reference)}
                          disabled={loading}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReference(reference.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={loading}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {references.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay referencias configuradas</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestión de Videos Demo</h1>
                <p className="text-gray-600 mt-2">Administra los videos demostrativos del curso</p>
              </div>
              <Dialog open={isVideoDemoDialogOpen} onOpenChange={setIsVideoDemoDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAddVideoDemoDialog}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={loading}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Video
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingVideoDemo ? "Editar Video Demo" : "Agregar Nuevo Video Demo"}</DialogTitle>
                    <DialogDescription>
                      {editingVideoDemo ? "Modifica el video existente" : "Agrega un nuevo video demostrativo"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Título del Video</label>
                      <Input
                        placeholder="Fundamentos de IA Generativa"
                        value={newVideoDemo.title}
                        onChange={(e) => setNewVideoDemo({ ...newVideoDemo, title: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL de YouTube</label>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={newVideoDemo.youtube_url}
                        onChange={(e) => setNewVideoDemo({ ...newVideoDemo, youtube_url: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descripción (Opcional)</label>
                      <Textarea
                        placeholder="Descripción del contenido del video..."
                        value={newVideoDemo.description}
                        onChange={(e) => setNewVideoDemo({ ...newVideoDemo, description: e.target.value })}
                        disabled={loading}
                        rows={3}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingVideoDemo ? handleEditVideoDemo : handleAddVideoDemo}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : editingVideoDemo ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsVideoDemoDialogOpen(false)} disabled={loading}>
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
                <CardDescription>Lista de videos demostrativos disponibles para los usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videoDemos.map((video) => {
                    const videoId = extractVideoId(video.youtube_url)
                    return (
                      <div key={video.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {videoId ? (
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                              Sin preview
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{video.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{video.description}</div>
                          <div className="text-sm text-gray-500 mt-2">
                            URL:{" "}
                            {video.youtube_url.length > 50 ? `${video.youtube_url.slice(0, 50)}...` : video.youtube_url}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditVideoDemoDialog(video)}
                            disabled={loading}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVideoDemo(video.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={loading}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  {videoDemos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay videos demo configurados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Testimonials Tab */}
        {activeTab === "testimonios" && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestión de Testimonios</h1>
                <p className="text-gray-600 mt-2">Administra testimonios de estudiantes y estadísticas</p>
              </div>
              <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAddTestimonialDialog}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={loading}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Testimonio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingTestimonial ? "Editar Testimonio" : "Agregar Nuevo Testimonio"}</DialogTitle>
                    <DialogDescription>
                      {editingTestimonial
                        ? "Modifica el testimonio existente"
                        : "Agrega un nuevo testimonio de estudiante"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Texto del Testimonio *</label>
                      <Textarea
                        placeholder="El curso transformó completamente nuestra forma de trabajar..."
                        value={newTestimonial.text}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                        disabled={loading}
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre (Opcional)</label>
                        <Input
                          placeholder="Roberto Silva"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cargo (Opcional)</label>
                        <Input
                          placeholder="Gerente de Operaciones"
                          value={newTestimonial.position}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Empresa (Opcional)</label>
                      <Input
                        placeholder="Empresa Retail Líder"
                        value={newTestimonial.company}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL de LinkedIn (Opcional)</label>
                      <Input
                        placeholder="https://linkedin.com/in/roberto-silva"
                        value={newTestimonial.linkedin_url}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, linkedin_url: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-2">
                      <Button
                        onClick={editingTestimonial ? handleEditTestimonial : handleAddTestimonial}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : editingTestimonial ? "Actualizar" : "Agregar"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsTestimonialDialogOpen(false)} disabled={loading}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Testimonial Stats */}
            {testimonialStats && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Estadísticas de Testimonios</CardTitle>
                  <CardDescription>Métricas que se muestran en la sección pública</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{testimonialStats.total_professionals}</div>
                      <div className="text-gray-600">Profesionales Capacitados</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const newValue = prompt(
                            "Nuevo número de profesionales:",
                            testimonialStats.total_professionals.toString(),
                          )
                          if (newValue && !isNaN(Number(newValue))) {
                            handleUpdateTestimonialStats({ total_professionals: Number(newValue) })
                          }
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{testimonialStats.satisfaction_rate}%</div>
                      <div className="text-gray-600">Satisfacción Promedio</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const newValue = prompt(
                            "Nueva tasa de satisfacción (%):",
                            testimonialStats.satisfaction_rate.toString(),
                          )
                          if (newValue && !isNaN(Number(newValue))) {
                            handleUpdateTestimonialStats({ satisfaction_rate: Number(newValue) })
                          }
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{testimonialStats.productivity_increase}%</div>
                      <div className="text-gray-600">Aumento Productividad</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const newValue = prompt(
                            "Nuevo aumento de productividad (%):",
                            testimonialStats.productivity_increase.toString(),
                          )
                          if (newValue && !isNaN(Number(newValue))) {
                            handleUpdateTestimonialStats({ productivity_increase: Number(newValue) })
                          }
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Texto Introductorio</label>
                    <Textarea
                      value={testimonialStats.intro_text}
                      onChange={(e) => handleUpdateTestimonialStats({ intro_text: e.target.value })}
                      rows={3}
                      placeholder="Texto que aparece en la sección de testimonios..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Testimonials List */}
            <Card>
              <CardHeader>
                <CardTitle>Testimonios Activos ({testimonials.length})</CardTitle>
                <CardDescription>Lista de testimonios disponibles para los usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{testimonial.name || "Testimonio Anónimo"}</div>
                          {testimonial.position && (
                            <div className="text-sm text-orange-600">{testimonial.position}</div>
                          )}
                          {testimonial.company && <div className="text-sm text-gray-600">{testimonial.company}</div>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditTestimonialDialog(testimonial)}
                            disabled={loading}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={loading}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-gray-700 italic mb-2">"{testimonial.text}"</div>
                      {testimonial.linkedin_url && (
                        <div className="text-sm text-blue-600">
                          <a href={testimonial.linkedin_url} target="_blank" rel="noopener noreferrer">
                            Ver perfil de LinkedIn
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                  {testimonials.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay testimonios configurados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Customization Tab */}
        {activeTab === "personalizacion" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Gestión de Personalización</h1>
              <p className="text-gray-600 mt-2">Administra el contenido de opciones de personalización del curso</p>
            </div>

            {/* Intro Text */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Texto Introductorio</CardTitle>
                <CardDescription>Texto que aparece al inicio de la sección de personalización</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={customizationContent.introText}
                  onChange={(e) => {
                    const newContent = { ...customizationContent, introText: e.target.value }
                    setCustomizationContent(newContent)
                    handleUpdateCustomizationContent(newContent)
                  }}
                  rows={3}
                  placeholder="Nuestro curso se adapta a cada organización..."
                />
              </CardContent>
            </Card>

            {/* Core Modules */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Módulos Core (Incluidos)</CardTitle>
                <CardDescription>Contenido fundamental que todos los participantes reciben</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customizationContent.coreModules.map((module, index) => (
                    <div key={module.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{module.name}</div>
                          {module.description && <div className="text-sm text-gray-600 mt-1">{module.description}</div>}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newName = prompt("Nuevo nombre del módulo:", module.name)
                            const newDescription = prompt("Nueva descripción:", module.description || "")
                            if (newName) {
                              const newModules = [...customizationContent.coreModules]
                              newModules[index] = { ...module, name: newName, description: newDescription }
                              const newContent = { ...customizationContent, coreModules: newModules }
                              setCustomizationContent(newContent)
                              handleUpdateCustomizationContent(newContent)
                            }
                          }}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const name = prompt("Nombre del nuevo módulo core:")
                      const description = prompt("Descripción del módulo:")
                      if (name) {
                        const newModule = {
                          id: Date.now().toString(),
                          name,
                          description: description || undefined,
                        }
                        const newContent = {
                          ...customizationContent,
                          coreModules: [...customizationContent.coreModules, newModule],
                        }
                        setCustomizationContent(newContent)
                        handleUpdateCustomizationContent(newContent)
                      }
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Módulo Core
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Customizable Modules */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Módulos Personalizables</CardTitle>
                <CardDescription>Módulos que se pueden seleccionar según las necesidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customizationContent.customizableModules.map((module, index) => (
                    <div key={module.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{module.name}</div>
                          {module.description && <div className="text-sm text-gray-600 mt-1">{module.description}</div>}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newName = prompt("Nuevo nombre del módulo:", module.name)
                            const newDescription = prompt("Nueva descripción:", module.description || "")
                            if (newName) {
                              const newModules = [...customizationContent.customizableModules]
                              newModules[index] = { ...module, name: newName, description: newDescription }
                              const newContent = { ...customizationContent, customizableModules: newModules }
                              setCustomizationContent(newContent)
                              handleUpdateCustomizationContent(newContent)
                            }
                          }}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const name = prompt("Nombre del nuevo módulo personalizable:")
                      const description = prompt("Descripción del módulo:")
                      if (name) {
                        const newModule = {
                          id: Date.now().toString(),
                          name,
                          description: description || undefined,
                        }
                        const newContent = {
                          ...customizationContent,
                          customizableModules: [...customizationContent.customizableModules, newModule],
                        }
                        setCustomizationContent(newContent)
                        handleUpdateCustomizationContent(newContent)
                      }
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Módulo Personalizable
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card>
              <CardHeader>
                <CardTitle>Opciones Adicionales</CardTitle>
                <CardDescription>Servicios premium y opciones extra</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customizationContent.additionalOptions.map((option, index) => (
                    <div key={option.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{option.name}</div>
                          {option.description && <div className="text-sm text-gray-600 mt-1">{option.description}</div>}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newName = prompt("Nuevo nombre de la opción:", option.name)
                            const newDescription = prompt("Nueva descripción:", option.description || "")
                            if (newName) {
                              const newOptions = [...customizationContent.additionalOptions]
                              newOptions[index] = { ...option, name: newName, description: newDescription }
                              const newContent = { ...customizationContent, additionalOptions: newOptions }
                              setCustomizationContent(newContent)
                              handleUpdateCustomizationContent(newContent)
                            }
                          }}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const name = prompt("Nombre de la nueva opción adicional:")
                      const description = prompt("Descripción de la opción:")
                      if (name) {
                        const newOption = {
                          id: Date.now().toString(),
                          name,
                          description: description || undefined,
                        }
                        const newContent = {
                          ...customizationContent,
                          additionalOptions: [...customizationContent.additionalOptions, newOption],
                        }
                        setCustomizationContent(newContent)
                        handleUpdateCustomizationContent(newContent)
                      }
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Opción Adicional
                  </Button>
                </div>
              </CardContent>
            </Card>
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
