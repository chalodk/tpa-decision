import { supabase, isSupabaseAvailable } from "./supabase"

const migrationSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create passwords table
CREATE TABLE IF NOT EXISTS passwords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  password TEXT NOT NULL UNIQUE,
  sales_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create references_text table
CREATE TABLE IF NOT EXISTS references_text (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create video_demos table
CREATE TABLE IF NOT EXISTS video_demos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  name TEXT,
  position TEXT,
  company TEXT,
  avatar TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonial_stats table
CREATE TABLE IF NOT EXISTS testimonial_stats (
  id TEXT PRIMARY KEY DEFAULT '1',
  total_professionals INTEGER NOT NULL DEFAULT 500,
  satisfaction_rate INTEGER NOT NULL DEFAULT 95,
  productivity_increase INTEGER NOT NULL DEFAULT 40,
  intro_text TEXT NOT NULL DEFAULT 'Más de 500 personas han pasado por nuestros cursos. Aquí puedes leer lo que dicen quienes ya transformaron su forma de trabajar gracias a la IA generativa.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for tracking
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  password TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  sections_visited TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customization_content table
CREATE TABLE IF NOT EXISTS customization_content (
  id TEXT PRIMARY KEY DEFAULT '1',
  intro_text TEXT NOT NULL DEFAULT 'Nuestro curso se adapta a cada organización. Estas son las opciones de personalización disponibles al contratarlo.',
  core_modules JSONB DEFAULT '[]',
  customizable_modules JSONB DEFAULT '[]',
  additional_options JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE references_text ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_content ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on passwords') THEN
    CREATE POLICY "Allow all operations on passwords" ON passwords FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on references_text') THEN
    CREATE POLICY "Allow all operations on references_text" ON references_text FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on video_demos') THEN
    CREATE POLICY "Allow all operations on video_demos" ON video_demos FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on testimonials') THEN
    CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on testimonial_stats') THEN
    CREATE POLICY "Allow all operations on testimonial_stats" ON testimonial_stats FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on sessions') THEN
    CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on customization_content') THEN
    CREATE POLICY "Allow all operations on customization_content" ON customization_content FOR ALL USING (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_password ON sessions(password);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_passwords_password ON passwords(password);
`

const seedDataSQL = `
-- Insert default passwords (only if table is empty)
INSERT INTO passwords (password, sales_email) 
SELECT 'demo2025', 'ventas@thepromptacademy.com'
WHERE NOT EXISTS (SELECT 1 FROM passwords WHERE password = 'demo2025');

INSERT INTO passwords (password, sales_email) 
SELECT 'tpa-client', 'asesor@thepromptacademy.com'
WHERE NOT EXISTS (SELECT 1 FROM passwords WHERE password = 'tpa-client');

INSERT INTO passwords (password, sales_email) 
SELECT 'academy123', 'comercial@thepromptacademy.com'
WHERE NOT EXISTS (SELECT 1 FROM passwords WHERE password = 'academy123');

-- Insert default references_text (only if table is empty)
INSERT INTO references_text (name, position, company, email, whatsapp) 
SELECT 'María González', 'Directora de Innovación', 'Banco Santander Chile', 'maria.gonzalez@santander.cl', '+56912345678'
WHERE NOT EXISTS (SELECT 1 FROM references_text LIMIT 1);

INSERT INTO references_text (name, position, company, email, whatsapp) 
SELECT 'Carlos Rodríguez', 'Gerente de Transformación Digital', 'Falabella', 'carlos.rodriguez@falabella.com', '+56987654321'
WHERE NOT EXISTS (SELECT 1 FROM references_text WHERE name = 'Carlos Rodríguez');

-- Insert default video demos (only if table is empty)
INSERT INTO video_demos (title, youtube_url, description) 
SELECT 'Fundamentos de IA Generativa', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Introducción completa a los conceptos básicos y aplicaciones prácticas'
WHERE NOT EXISTS (SELECT 1 FROM video_demos LIMIT 1);

-- Insert default testimonials (only if table is empty)
INSERT INTO testimonials (text, name, position, company, linkedin_url) 
SELECT 'El curso de The Prompt Academy transformó completamente nuestra forma de trabajar. En 3 meses implementamos soluciones de IA que aumentaron nuestra productividad en un 40%. El ROI fue evidente desde la primera semana.', 'Roberto Silva', 'Gerente de Operaciones', 'Empresa Retail Líder', 'https://linkedin.com/in/roberto-silva'
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);

-- Insert default testimonial stats (only if not exists)
INSERT INTO testimonial_stats (id, total_professionals, satisfaction_rate, productivity_increase, intro_text) 
SELECT '1', 500, 95, 40, 'Más de 500 personas han pasado por nuestros cursos. Aquí puedes leer lo que dicen quienes ya transformaron su forma de trabajar gracias a la IA generativa.'
WHERE NOT EXISTS (SELECT 1 FROM testimonial_stats WHERE id = '1');

-- Insert default customization content (only if not exists)
INSERT INTO customization_content (id, intro_text, core_modules, customizable_modules, additional_options) 
SELECT '1', 'Nuestro curso se adapta a cada organización. Estas son las opciones de personalización disponibles al contratarlo.',
   '[
     {"id": "1", "name": "Fundamentos de IA Generativa y conceptos clave", "description": "Base teórica esencial para entender la tecnología"},
     {"id": "2", "name": "Técnicas de Prompting efectivo y optimización", "description": "Metodologías para crear prompts que generen mejores resultados"}
   ]'::jsonb,
   '[
     {"id": "1", "name": "Casos de uso por sector (marketing, legal, educación, finanzas)", "description": "Aplicaciones específicas según la industria del cliente"}
   ]'::jsonb,
   '[
     {"id": "1", "name": "Talleres sincrónicos en vivo con expertos", "description": "Sesiones interactivas con especialistas del sector"}
   ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM customization_content WHERE id = '1');
`

export async function runAutoMigration(): Promise<{ success: boolean; message: string }> {
  try {
    if (!isSupabaseAvailable()) {
      return { success: false, message: "Supabase no está disponible" }
    }

    console.log("🔄 Ejecutando migración automática...")

    // Execute the main migration SQL
    const { error: migrationError } = await supabase.rpc("exec", {
      query: migrationSQL,
    })

    if (migrationError) {
      console.error("Error en migración:", migrationError)
      return { success: false, message: `Error en migración: ${migrationError.message}` }
    }

    console.log("✅ Tablas creadas exitosamente")

    // Execute the seed data SQL
    const { error: seedError } = await supabase.rpc("exec", {
      query: seedDataSQL,
    })

    if (seedError) {
      console.error("Error en datos iniciales:", seedError)
      return { success: false, message: `Error en datos iniciales: ${seedError.message}` }
    }

    console.log("✅ Datos iniciales insertados exitosamente")
    return { success: true, message: "Migración completada exitosamente" }
  } catch (error) {
    console.error("Error en migración automática:", error)
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}
