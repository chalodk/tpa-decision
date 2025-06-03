import RunMigration from "@/scripts/run-migration"

export default function MigrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-slate-800 rounded-lg flex items-center justify-center font-bold">
              3C
            </div>
            <div className="font-semibold">The Prompt Academy</div>
          </div>
          <h1 className="text-3xl font-bold mt-6 mb-2">Migración de Base de Datos</h1>
          <p className="text-gray-300">Ejecuta la migración inicial para configurar las tablas en Supabase</p>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <RunMigration />
      </div>
    </div>
  )
}
