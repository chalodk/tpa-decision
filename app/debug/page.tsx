import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DatabaseTest from "./database-test"

export default function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Página de Diagnóstico</h1>

      <Tabs defaultValue="database">
        <TabsList className="mb-4">
          <TabsTrigger value="database">Pruebas de Base de Datos</TabsTrigger>
          <TabsTrigger value="environment">Variables de Entorno</TabsTrigger>
        </TabsList>

        <TabsContent value="database">
          <DatabaseTest />
        </TabsContent>

        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle>Variables de Entorno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Variables de Supabase</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium text-gray-600">NEXT_PUBLIC_SUPABASE_URL</div>
                    <div className="text-sm">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                        <span className="text-green-600">✓ Configurado</span>
                      ) : (
                        <span className="text-red-600">✗ No configurado</span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-600">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                    <div className="text-sm">
                      {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                        <span className="text-green-600">✓ Configurado</span>
                      ) : (
                        <span className="text-red-600">✗ No configurado</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
