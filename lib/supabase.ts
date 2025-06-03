import { createClient } from "@supabase/supabase-js"

// Verificar si las variables de entorno están disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Crear cliente solo si ambas variables están disponibles
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Tipos para las tablas
export interface Password {
  id: string
  password: string
  sales_email: string
  created_at: string
}

export interface Reference {
  id: string
  name: string
  position: string
  company: string
  email: string
  whatsapp: string
  created_at: string
}

export interface VideoDemo {
  id: string
  title: string
  youtube_url: string
  description?: string
  created_at: string
}

export interface Testimonial {
  id: string
  text: string
  name?: string
  position?: string
  company?: string
  avatar?: string
  linkedin_url?: string
  created_at: string
}

export interface TestimonialStats {
  id: string
  total_professionals: number
  satisfaction_rate: number
  productivity_increase: number
  intro_text: string
  updated_at: string
}

export interface Session {
  id: string
  password: string
  start_time: string
  end_time?: string
  duration?: number
  sections_visited: string[]
  is_active: boolean
  created_at: string
}

// Función para verificar si Supabase está disponible
export function isSupabaseAvailable(): boolean {
  return !!supabase
}
