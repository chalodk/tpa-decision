"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon, AlertCircleIcon, SettingsIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { getPasswords, initializeDatabase } from "@/lib/database"

// Importar Dashboard dinámicamente para evitar problemas de SSR
const Dashboard = dynamic(() => import("./components/Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    </div>
  ),
})

function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validPasswords, setValidPasswords] = useState<string[]>([])
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "fallback">("checking")

  useEffect(() => {
    // Cargar contraseñas válidas desde Supabase
    const loadValidPasswords = async () => {
      try {
        console.log("🔄 Verificando conexión a Supabase...")

        // Verificar si las variables de entorno están configuradas
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        console.log("Variables de entorno:", {
          url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "❌ No configurado",
          key: supabaseKey ? `${supabaseKey.substring(0, 30)}...` : "❌ No configurado",
        })

        if (!supabaseUrl || !supabaseKey) {
          console.warn("⚠️ Variables de entorno de Supabase no configuradas")
          throw new Error("Variables de Supabase no configuradas")
        }

        // Verificar conexión
        const isConnected = await initializeDatabase()

        if (isConnected) {
          const passwords = await getPasswords()
          setValidPasswords(passwords.map((p) => p.password))
          setDbStatus("connected")
          console.log("✅ Conectado a Supabase - Contraseñas cargadas:", passwords.length)
        } else {
          throw new Error("No se pudo conectar a Supabase o las tablas no existen")
        }
      } catch (error) {
        console.warn("⚠️ Supabase no disponible o tablas no existen, usando modo fallback:", error)

        // Fallback a contraseñas por defecto
        const fallbackPasswords = ["demo2025", "tpa-client", "academy123"]
        setValidPasswords(fallbackPasswords)
        setDbStatus("fallback")

        // Inicializar localStorage si no existe
        if (typeof window !== "undefined") {
          const savedPasswords = localStorage.getItem("tpa-admin-passwords")
          if (!savedPasswords) {
            const defaultPasswordObjects = [
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
            localStorage.setItem("tpa-admin-passwords", JSON.stringify(defaultPasswordObjects))
          }
        }
      }
    }

    loadValidPasswords()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (validPasswords.includes(password)) {
        // Guardar en localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("tpa-authenticated", "true")
          localStorage.setItem("tpa-current-password", password)
          localStorage.setItem("tpa-db-mode", dbStatus)
        }
        onLogin(password)
      } else {
        setError("Contraseña incorrecta. Por favor verifica con tu asesor comercial.")
      }
    } catch (err) {
      console.error("Error in handleLogin:", err)
      setError("Error interno. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Background */}
      <section className="bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-slate-800 rounded-lg flex items-center justify-center font-bold">
                3C
              </div>
              <div className="font-semibold">The Prompt Academy</div>
            </div>
            <div className="text-right">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg">
                Área de Decisión
              </Button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Área de Decisión y Prueba</h1>
            <h2 className="text-2xl md:text-3xl text-orange-500 font-semibold mb-6">
              Capacitación Ejecutiva en Inteligencia Artificial Generativa
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Contenido exclusivo para clientes en proceso de evaluación
            </p>
          </div>
        </div>
      </section>

      {/* Password Access Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <LockIcon className="h-6 w-6 text-orange-600" />
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Acceso Protegido</span>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">Ingrese su contraseña</CardTitle>
              <CardDescription className="text-gray-600">
                Utilice la contraseña proporcionada por su asesor comercial
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {/* Database Status */}
              <div className="mb-4 p-3 rounded-lg text-sm">
                {dbStatus === "checking" && (
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Verificando conexión a base de datos...</span>
                  </div>
                )}
                {dbStatus === "connected" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <span>✅ Conectado a Supabase</span>
                  </div>
                )}
                {dbStatus === "fallback" && (
                  <div className="flex items-center gap-2 text-orange-600 bg-orange-50">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span>⚠️ Modo local - Migración requerida</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open("/migration", "_blank")}
                      className="ml-2 text-xs"
                    >
                      <SettingsIcon className="h-3 w-3 mr-1" />
                      Ejecutar Migración
                    </Button>
                  </div>
                )}
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Contraseña de acceso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                    disabled={isLoading || dbStatus === "checking"}
                  />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold"
                  disabled={isLoading || dbStatus === "checking"}
                >
                  {isLoading ? "Verificando..." : "Acceder al contenido"}
                </Button>
              </form>

              {/* Debug info en desarrollo */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs space-y-1">
                  <div>Contraseñas válidas: {validPasswords.join(", ")}</div>
                  <div>Estado DB: {dbStatus}</div>
                  <div>
                    Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurado" : "❌ No configurado"}
                  </div>
                  <div>
                    Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ No configurado"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")

  useEffect(() => {
    // Verificar autenticación existente
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const auth = localStorage.getItem("tpa-authenticated")
        const password = localStorage.getItem("tpa-current-password")

        if (auth === "true" && password) {
          setIsAuthenticated(true)
          setCurrentPassword(password)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (password: string) => {
    setCurrentPassword(password)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tpa-authenticated")
      localStorage.removeItem("tpa-current-password")
      localStorage.removeItem("tpa-db-mode")
    }
    setIsAuthenticated(false)
    setCurrentPassword("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} currentPassword={currentPassword} />
  }

  return <LoginForm onLogin={handleLogin} />
}
