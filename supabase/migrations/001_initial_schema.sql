-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create passwords table
CREATE TABLE IF NOT EXISTS passwords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  password TEXT NOT NULL UNIQUE,
  sales_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create references table
CREATE TABLE IF NOT EXISTS references (
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

-- Clear existing data (in case of re-run)
DELETE FROM passwords;
DELETE FROM references;
DELETE FROM video_demos;
DELETE FROM testimonials;
DELETE FROM testimonial_stats;
DELETE FROM customization_content;

-- Insert default passwords
INSERT INTO passwords (password, sales_email) VALUES
  ('demo2025', 'ventas@thepromptacademy.com'),
  ('tpa-client', 'asesor@thepromptacademy.com'),
  ('academy123', 'comercial@thepromptacademy.com');

-- Insert default references
INSERT INTO references (name, position, company, email, whatsapp) VALUES
  ('María González', 'Directora de Innovación', 'Banco Santander Chile', 'maria.gonzalez@santander.cl', '+56912345678'),
  ('Carlos Rodríguez', 'Gerente de Transformación Digital', 'Falabella', 'carlos.rodriguez@falabella.com', '+56987654321'),
  ('Ana Martínez', 'Head of Operations', 'Latam Airlines', 'ana.martinez@latam.com', '+56911223344'),
  ('Roberto Silva', 'Director de Tecnología', 'BCI', 'roberto.silva@bci.cl', '+56955667788'),
  ('Patricia López', 'Gerente de Capacitación', 'Entel', 'patricia.lopez@entel.cl', '+56933445566');

-- Insert default video demos
INSERT INTO video_demos (title, youtube_url, description) VALUES
  ('Fundamentos de IA Generativa', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Introducción completa a los conceptos básicos y aplicaciones prácticas'),
  ('Técnicas Avanzadas de Prompting', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Metodologías para crear prompts efectivos y obtener mejores resultados'),
  ('Aplicaciones Empresariales', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Casos de uso reales en diferentes sectores e industrias'),
  ('Workshop: Automatización con IA', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Sesión práctica de implementación de soluciones automatizadas');

-- Insert default testimonials
INSERT INTO testimonials (text, name, position, company, linkedin_url) VALUES
  ('El curso de The Prompt Academy transformó completamente nuestra forma de trabajar. En 3 meses implementamos soluciones de IA que aumentaron nuestra productividad en un 40%. El ROI fue evidente desde la primera semana.', 'Roberto Silva', 'Gerente de Operaciones', 'Empresa Retail Líder', 'https://linkedin.com/in/roberto-silva'),
  ('La metodología es excelente y muy práctica. Nuestro equipo pasó de no conocer nada sobre IA generativa a implementar chatbots y automatizaciones en solo 2 semanas. Los instructores son expertos reales.', 'Patricia López', 'Directora de Marketing', 'Fintech Innovadora', NULL),
  ('Superó nuestras expectativas completamente. No solo aprendimos sobre IA, sino que desarrollamos una estrategia integral para nuestra transformación digital. El acompañamiento post-curso fue fundamental.', 'Miguel Torres', 'CTO', 'Startup Tecnológica', 'https://linkedin.com/in/miguel-torres-cto'),
  ('La inversión se recuperó en menos de 6 meses. Ahora tenemos un equipo capacitado que puede implementar soluciones de IA de forma autónoma. Recomiendo totalmente The Prompt Academy.', 'Carmen Ruiz', 'Directora de Innovación', 'Corporación Multinacional', NULL),
  ('El contenido es actualizado, relevante y aplicable inmediatamente. Nuestros procesos de atención al cliente mejoraron significativamente gracias a las técnicas aprendidas.', 'Diego Fernández', 'Head of Customer Experience', 'Empresa de Servicios', 'https://linkedin.com/in/diego-fernandez-cx'),
  ('Excelente programa. La combinación de teoría y práctica es perfecta. Nuestro equipo está motivado y aplicando todo lo aprendido en proyectos reales con resultados medibles.', 'Andrea Morales', 'Gerente de Transformación', 'Banco Regional', NULL);

-- Insert default testimonial stats
INSERT INTO testimonial_stats (total_professionals, satisfaction_rate, productivity_increase, intro_text) VALUES
  (500, 95, 40, 'Más de 500 personas han pasado por nuestros cursos. Aquí puedes leer lo que dicen quienes ya transformaron su forma de trabajar gracias a la IA generativa.');

-- Insert default customization content
INSERT INTO customization_content (intro_text, core_modules, customizable_modules, additional_options) VALUES
  ('Nuestro curso se adapta a cada organización. Estas son las opciones de personalización disponibles al contratarlo.',
   '[
     {"id": "1", "name": "Fundamentos de IA Generativa y conceptos clave", "description": "Base teórica esencial para entender la tecnología"},
     {"id": "2", "name": "Técnicas de Prompting efectivo y optimización", "description": "Metodologías para crear prompts que generen mejores resultados"},
     {"id": "3", "name": "Aplicaciones en productividad individual y equipos", "description": "Casos prácticos para mejorar la eficiencia personal y grupal"},
     {"id": "4", "name": "Herramientas principales: ChatGPT, Claude, Gemini", "description": "Dominio de las plataformas más utilizadas en el mercado"},
     {"id": "5", "name": "Ética y mejores prácticas en IA empresarial", "description": "Uso responsable y consideraciones éticas en entornos corporativos"}
   ]',
   '[
     {"id": "1", "name": "Casos de uso por sector (marketing, legal, educación, finanzas)", "description": "Aplicaciones específicas según la industria del cliente"},
     {"id": "2", "name": "Automatización con herramientas no-code (Zapier, Make)", "description": "Integración de IA con flujos de trabajo automatizados"},
     {"id": "3", "name": "Integraciones con Microsoft 365 y Google Workspace", "description": "Optimización de herramientas de productividad empresarial"},
     {"id": "4", "name": "Creación de chatbots y asistentes virtuales", "description": "Desarrollo de soluciones conversacionales personalizadas"},
     {"id": "5", "name": "Análisis de datos y generación de reportes", "description": "Uso de IA para insights y visualización de información"},
     {"id": "6", "name": "Gestión del cambio y adopción organizacional", "description": "Estrategias para implementar IA en equipos de trabajo"}
   ]',
   '[
     {"id": "1", "name": "Talleres sincrónicos en vivo con expertos", "description": "Sesiones interactivas con especialistas del sector"},
     {"id": "2", "name": "Branding institucional en todos los materiales", "description": "Personalización visual con la identidad de la empresa"},
     {"id": "3", "name": "Diagnóstico inicial y plan de implementación", "description": "Evaluación previa y roadmap personalizado"},
     {"id": "4", "name": "Sesiones de coaching 1:1 personalizadas", "description": "Acompañamiento individual para casos específicos"},
     {"id": "5", "name": "Certificación oficial de participación", "description": "Documento formal que acredita la capacitación"},
     {"id": "6", "name": "Soporte técnico extendido (3-6 meses)", "description": "Asistencia continua post-capacitación"},
     {"id": "7", "name": "Acceso a comunidad exclusiva de alumni", "description": "Red de contactos y intercambio de experiencias"},
     {"id": "8", "name": "Actualizaciones de contenido por 12 meses", "description": "Acceso a nuevos materiales y tendencias"}
   ]');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_password ON sessions(password);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_passwords_password ON passwords(password);

-- Enable Row Level Security (RLS)
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE references ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_content ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now, you can restrict later)
CREATE POLICY "Allow all operations on passwords" ON passwords FOR ALL USING (true);
CREATE POLICY "Allow all operations on references" ON references FOR ALL USING (true);
CREATE POLICY "Allow all operations on video_demos" ON video_demos FOR ALL USING (true);
CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Allow all operations on testimonial_stats" ON testimonial_stats FOR ALL USING (true);
CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on customization_content" ON customization_content FOR ALL USING (true);
