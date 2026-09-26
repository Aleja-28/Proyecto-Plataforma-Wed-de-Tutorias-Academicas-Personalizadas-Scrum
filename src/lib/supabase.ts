import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Subject, UserProfile } from '../types';

// Leer variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar si las credenciales están configuradas
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== ''
  );
};

// Cliente perezoso de Supabase
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Error al inicializar cliente de Supabase:', err);
      return null;
    }
  }
  return supabaseInstance;
};

// Mapeo entre modelo de TypeScript y Supabase (snake_case)
export interface SupabaseSubjectRow {
  id: string;
  user_id?: string | null;
  name: string;
  code?: string | null;
  credits: number;
  professor?: string | null;
  classroom?: string | null;
  difficulty: string;
  scale_max: number;
  min_passing_grade: number;
  target_grade: number;
  cuts: any; // jsonb
  is_completed: boolean;
  final_grade?: number | null;
  semester_period: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function mapSubjectToRow(subject: Subject, userId?: string | null): SupabaseSubjectRow {
  return {
    id: subject.id,
    user_id: userId || null,
    name: subject.name,
    code: subject.code || null,
    credits: Number(subject.credits) || 3,
    professor: subject.professor || null,
    classroom: subject.classroom || null,
    difficulty: subject.difficulty,
    scale_max: Number(subject.scaleMax) || 5.0,
    min_passing_grade: Number(subject.minPassingGrade) || 3.0,
    target_grade: Number(subject.targetGrade) || 4.0,
    cuts: subject.cuts || [],
    is_completed: Boolean(subject.isCompleted),
    final_grade: subject.finalGrade !== undefined && subject.finalGrade !== null ? Number(subject.finalGrade) : null,
    semester_period: subject.semesterPeriod || '2026-1',
    notes: subject.notes || null,
    updated_at: new Date().toISOString(),
  };
}

export function mapRowToSubject(row: SupabaseSubjectRow): Subject {
  return {
    id: row.id,
    name: row.name,
    code: row.code || undefined,
    credits: Number(row.credits) || 3,
    professor: row.professor || undefined,
    classroom: row.classroom || undefined,
    difficulty: (row.difficulty as any) || 'media',
    scaleMax: Number(row.scale_max) || 5.0,
    minPassingGrade: Number(row.min_passing_grade) || 3.0,
    targetGrade: Number(row.target_grade) || 4.0,
    cuts: Array.isArray(row.cuts) ? row.cuts : [],
    isCompleted: Boolean(row.is_completed),
    finalGrade: row.final_grade !== null && row.final_grade !== undefined ? Number(row.final_grade) : undefined,
    semesterPeriod: row.semester_period || '2026-1',
    notes: row.notes || undefined,
  };
}

// -------------------------------------------------------------
// OPERACIONES DE SUPABASE: MATERIAS (CRUD)
// -------------------------------------------------------------

/**
 * Obtiene todas las materias desde Supabase.
 */
export async function fetchSubjectsFromSupabase(userId?: string): Promise<{ data: Subject[] | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: 'Supabase no está configurado.' };
  }

  try {
    let query = supabase.from('subjects').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;
    if (error) {
      return { data: null, error: error.message };
    }

    const mappedSubjects: Subject[] = (data || []).map(mapRowToSubject);
    return { data: mappedSubjects, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al conectar con Supabase' };
  }
}

/**
 * Inserta o actualiza una materia en Supabase.
 */
export async function upsertSubjectInSupabase(
  subject: Subject, 
  userId?: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const row = mapSubjectToRow(subject, userId);
    const { error } = await supabase.from('subjects').upsert(row, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar materia en Supabase' };
  }
}

/**
 * Elimina una materia de Supabase por ID.
 */
export async function deleteSubjectFromSupabase(subjectId: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { error } = await supabase.from('subjects').delete().eq('id', subjectId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al eliminar materia en Supabase' };
  }
}

// -------------------------------------------------------------
// OPERACIONES DE SUPABASE: PERFIL Y REGISTRO
// -------------------------------------------------------------

export async function saveProfileInSupabase(profile: UserProfile): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase no está configurado.' };
  }

  try {
    const { error } = await supabase.from('profiles').upsert({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      institution: profile.institution,
      career: profile.career,
      semester: profile.semester,
      avatar_seed: profile.avatarSeed,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar perfil en Supabase' };
  }
}

export async function fetchProfileFromSupabase(userId: string): Promise<{ data: UserProfile | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: 'Supabase no está configurado.' };
  }

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) {
      return { data: null, error: error.message };
    }
    if (!data) {
      return { data: null, error: null };
    }

    const profile: UserProfile = {
      id: data.id,
      name: data.name || 'Estudiante',
      email: data.email || '',
      institution: data.institution || '',
      career: data.career || '',
      semester: data.semester || '',
      avatarSeed: data.avatar_seed || 'estudiante-1',
      isDemo: false,
    };
    return { data: profile, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Error al obtener perfil' };
  }
}

// -------------------------------------------------------------
// ESQUEMA SQL PARA CREAR EN EL SQL EDITOR DE SUPABASE
// -------------------------------------------------------------
export const SUPABASE_SQL_SCHEMA = `-- Copia y pega este script en el SQL Editor de tu proyecto en Supabase:
-- 1. Tabla de Perfiles de Estudiantes
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  institution TEXT,
  career TEXT,
  semester TEXT,
  avatar_seed TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Asignaturas / Materias
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT,
  credits INTEGER DEFAULT 3,
  professor TEXT,
  classroom TEXT,
  difficulty TEXT DEFAULT 'media',
  scale_max NUMERIC DEFAULT 5.0,
  min_passing_grade NUMERIC DEFAULT 3.0,
  target_grade NUMERIC DEFAULT 4.0,
  cuts JSONB DEFAULT '[]'::jsonb,
  is_completed BOOLEAN DEFAULT FALSE,
  final_grade NUMERIC,
  semester_period TEXT DEFAULT '2026-1',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para lectura y escritura directa (sin error de sintaxis en PostgreSQL)
DROP POLICY IF EXISTS "Permitir todo en profiles" ON public.profiles;
CREATE POLICY "Permitir todo en profiles" ON public.profiles FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en subjects" ON public.subjects;
CREATE POLICY "Permitir todo en subjects" ON public.subjects FOR ALL TO public USING (true) WITH CHECK (true);
`;
