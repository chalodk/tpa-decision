import { supabase, isSupabaseAvailable } from "./supabase"
import type { Password, Reference, VideoDemo, Testimonial, TestimonialStats, Session } from "./supabase"

// Funciones para Passwords
export async function getPasswords(): Promise<Password[]> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible, usando datos locales")
    // Fallback a localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tpa-admin-passwords")
      if (stored) {
        return JSON.parse(stored)
      }
    }
    return []
  }

  const { data, error } = await supabase.from("passwords").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching passwords:", error)
    throw error
  }
  return data || []
}

export async function createPassword(password: Omit<Password, "id" | "created_at">): Promise<Password> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("passwords").insert([password]).select().single()

  if (error) {
    console.error("Error creating password:", error)
    throw error
  }
  return data
}

export async function updatePassword(id: string, updates: Partial<Password>): Promise<Password> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("passwords").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating password:", error)
    throw error
  }
  return data
}

export async function deletePassword(id: string): Promise<void> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { error } = await supabase.from("passwords").delete().eq("id", id)

  if (error) {
    console.error("Error deleting password:", error)
    throw error
  }
}

// Funciones para References
export async function getReferences(): Promise<Reference[]> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    return []
  }
  const { data, error } = await supabase.from("references").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching references:", error)
    throw error
  }
  return data || []
}

export async function createReference(reference: Omit<Reference, "id" | "created_at">): Promise<Reference> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("references").insert([reference]).select().single()

  if (error) {
    console.error("Error creating reference:", error)
    throw error
  }
  return data
}

export async function updateReference(id: string, updates: Partial<Reference>): Promise<Reference> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("references").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating reference:", error)
    throw error
  }
  return data
}

export async function deleteReference(id: string): Promise<void> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { error } = await supabase.from("references").delete().eq("id", id)

  if (error) {
    console.error("Error deleting reference:", error)
    throw error
  }
}

// Funciones para Video Demos
export async function getVideoDemos(): Promise<VideoDemo[]> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    return []
  }
  const { data, error } = await supabase.from("video_demos").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching video demos:", error)
    throw error
  }
  return data || []
}

export async function createVideoDemo(videoDemo: Omit<VideoDemo, "id" | "created_at">): Promise<VideoDemo> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("video_demos").insert([videoDemo]).select().single()

  if (error) {
    console.error("Error creating video demo:", error)
    throw error
  }
  return data
}

export async function updateVideoDemo(id: string, updates: Partial<VideoDemo>): Promise<VideoDemo> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("video_demos").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating video demo:", error)
    throw error
  }
  return data
}

export async function deleteVideoDemo(id: string): Promise<void> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { error } = await supabase.from("video_demos").delete().eq("id", id)

  if (error) {
    console.error("Error deleting video demo:", error)
    throw error
  }
}

// Funciones para Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    return []
  }
  const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching testimonials:", error)
    throw error
  }
  return data || []
}

export async function createTestimonial(testimonial: Omit<Testimonial, "id" | "created_at">): Promise<Testimonial> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("testimonials").insert([testimonial]).select().single()

  if (error) {
    console.error("Error creating testimonial:", error)
    throw error
  }
  return data
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating testimonial:", error)
    throw error
  }
  return data
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { error } = await supabase.from("testimonials").delete().eq("id", id)

  if (error) {
    console.error("Error deleting testimonial:", error)
    throw error
  }
}

// Funciones para Testimonial Stats
export async function getTestimonialStats(): Promise<TestimonialStats | null> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    return null
  }
  const { data, error } = await supabase.from("testimonial_stats").select("*").single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching testimonial stats:", error)
    throw error
  }
  return data
}

export async function updateTestimonialStats(
  stats: Omit<TestimonialStats, "id" | "updated_at">,
): Promise<TestimonialStats> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase
    .from("testimonial_stats")
    .upsert([{ id: "1", ...stats }])
    .select()
    .single()

  if (error) {
    console.error("Error updating testimonial stats:", error)
    throw error
  }
  return data
}

// Funciones para Sessions (tracking)
export async function createSession(session: Omit<Session, "id" | "created_at">): Promise<Session> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("sessions").insert([session]).select().single()

  if (error) {
    console.error("Error creating session:", error)
    throw error
  }
  return data
}

export async function updateSession(id: string, updates: Partial<Session>): Promise<Session> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase.from("sessions").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating session:", error)
    throw error
  }
  return data
}

export async function getSessions(): Promise<Session[]> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    return []
  }
  const { data, error } = await supabase.from("sessions").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching sessions:", error)
    throw error
  }
  return data || []
}

export async function getSessionsByPassword(password: string): Promise<Session[]> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    return []
  }
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("password", password)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching sessions by password:", error)
    throw error
  }
  return data || []
}

// Funciones para Customization Content
export async function getCustomizationContent(): Promise<any> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    return null
  }
  const { data, error } = await supabase.from("customization_content").select("*").single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching customization content:", error)
    throw error
  }
  return data
}

export async function updateCustomizationContent(content: any): Promise<any> {
  if (!isSupabaseAvailable()) {
    console.warn("Supabase no disponible")
    throw new Error("Supabase is not available")
  }
  const { data, error } = await supabase
    .from("customization_content")
    .upsert([{ id: "1", ...content }])
    .select()
    .single()

  if (error) {
    console.error("Error updating customization content:", error)
    throw error
  }
  return data
}

// Función de inicialización para verificar conexión
export async function initializeDatabase(): Promise<boolean> {
  try {
    if (!isSupabaseAvailable()) {
      console.warn("❌ Supabase no está configurado - variables de entorno faltantes")
      return false
    }

    const { data, error } = await supabase.from("passwords").select("count").single()
    if (error) throw error
    console.log("✅ Conexión a Supabase exitosa")
    return true
  } catch (error) {
    console.error("❌ Error conectando a Supabase:", error)
    return false
  }
}
