"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" />
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Error de Aplicación</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Algo salió mal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Ha ocurrido un error inesperado. Por favor intenta recargar la página.
          </p>

          <div className="space-y-2">
            <Button onClick={reset} className="w-full bg-orange-600 hover:bg-orange-700">
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Intentar de nuevo
            </Button>

            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Recargar página
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="text-sm text-gray-500 cursor-pointer">Detalles técnicos (desarrollo)</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{error.message}</pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
