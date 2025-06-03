"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase, isSupabaseAvailable } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

// Import the migration SQL
import migrationSQL from "@/supabase/migrations/001_initial_schema.sql"

export default function RunMigration() {
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [envVars, setEnvVars] = useState({
    url: "",
    key: "",
  })

  useEffect(() => {
    // Check environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    setEnvVars({
      url: url ? `${url.substring(0, 15)}...` : "No configurado",
      key: key ? `${key.substring(0, 15)}...` : "No configurado",
    })
  }, [])

  const addLog = (text: string) => {
    setLogs((prev) => [...prev, text])
  }

  const runMigration = async () => {
    setStatus("running")
    setMessage("")
    setLogs([])

    try {
      // Check if Supabase is available
      if (!isSupabaseAvailable()) {
        throw new Error("Supabase no está disponible. Verifica las variables de entorno.")
      }

      addLog("✅ Cliente Supabase inicializado correctamente")

      // Test connection
      addLog("🔄 Probando conexión a Supabase...")
      const { data: connTest, error: connError } = await supabase.from("passwords").select("count")

      if (connError) {
        throw new Error(`Error de conexión: ${connError.message}`)
      }

      addLog("✅ Conexión a Supabase exitosa")

      // Run migration
      addLog("🔄 Ejecutando migración...")

      // Split the SQL into separate statements
      const statements = migrationSQL
        .replace(/--.*$/gm, "") // Remove comments
        .split(";")
        .filter((statement) => statement.trim().length > 0)

      addLog(`📊 Encontradas ${statements.length} sentencias SQL para ejecutar`)

      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i]
        addLog(`🔄 Ejecutando sentencia ${i + 1}/${statements.length}...`)

        const { error } = await supabase.rpc("exec", { query: statement })

        if (error) {
          addLog(`❌ Error en sentencia ${i + 1}: ${error.message}`)
          // Continue with next statement
        } else {
          addLog(`✅ Sentencia ${i + 1} ejecutada correctamente`)
        }
      }

      // Verify tables were created
      addLog("🔄 Verificando tablas creadas...")
      const tables = [
        "passwords",
        "references",
        "video_demos",
        "testimonials",
        "testimonial_stats",
        "sessions",
        "customization_content",
      ]

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select("count")

        if (error) {
          addLog(`❌ Tabla ${table} no encontrada o error: ${error.message}`)
        } else {
          addLog(`✅ Tabla ${table} creada correctamente`)
        }
      }

      setStatus("success")
      setMessage("Migración completada correctamente")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Error desconocido")
      addLog(`❌ Error: ${error instanceof Error ? error.message : "Error desconocido"}`)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Ejecutar Migración de Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Environment Variables */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Variables de entorno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="font-medium">NEXT_PUBLIC_SUPABASE_URL</div>
                  <div className="text-sm text-gray-500">{envVars.url}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                  <div className="text-sm text-gray-500">{envVars.key}</div>
                </div>
              </div>
            </div>

            {/* Status */}
            {status === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Éxito</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Run Button */}
            <Button onClick={runMigration} disabled={status === "running"} className="w-full">
              {status === "running" ? "Ejecutando..." : "Ejecutar Migración"}
            </Button>

            {/* Logs */}
            {logs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Logs</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-96">
                  {logs.map((log, i) => (
                    <div key={i} className="font-mono text-sm">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning about URL */}
            {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("!") && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle>Advertencia</AlertTitle>
                <AlertDescription>
                  La URL de Supabase contiene un carácter de exclamación (!), lo cual no es válido en una URL. Por favor
                  verifica y corrige la URL en el archivo .env.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
