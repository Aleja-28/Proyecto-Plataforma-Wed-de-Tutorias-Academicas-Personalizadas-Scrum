export type DifficultyLevel = 'baja' | 'media' | 'alta' | 'critica';

export type EvaluationType = 
  | 'parcial'
  | 'taller'
  | 'proyecto'
  | 'quices'
  | 'laboratorio'
  | 'exposicion'
  | 'mixto';

export interface Topic {
  id: string;
  name: string;
  isDifficult: boolean; // Requisito 8: Indicar tema de mayor dificultad
  notes?: string;
  keyConcepts?: string[];
}

export interface Cut {
  id: string;
  name: string; // ej: "Corte 1", "Corte 2", "Corte 3" o "Parcial 1"
  percentage: number; // Porcentaje de ponderación (ej: 30)
  grade: number | null; // Nota ingresada (null si aún no se ha cursado)
  evaluationType: EvaluationType; // Requisito 17: Tipo de evaluación
  evaluationDetails?: string; // ej: "Examen escrito 70% + 2 Quices 30%"
  topics: Topic[]; // Requisito 7: Temas vistos por corte
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  credits: number;
  professor?: string;
  classroom?: string;
  difficulty: DifficultyLevel; // Requisito 15: Nivel de dificultad
  scaleMax: number; // Por defecto 5.0 (o 100)
  minPassingGrade: number; // Por defecto 3.0 (o 60)
  targetGrade: number; // Requisito 5: Nota objetivo (ej: 4.2)
  cuts: Cut[]; // Requisito 3: Cortes cursados
  isCompleted: boolean; // Requisito 13: Historial
  finalGrade?: number;
  semesterPeriod: string; // ej: "2026-1"
  notes?: string;
}

export interface ExerciseItem {
  id: string;
  topicName: string;
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  question: string;
  hint: string;
  sampleSolution?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'guia' | 'formula' | 'video' | 'resumen';
  description: string;
  url?: string;
  keyPoints: string[];
}

export interface Workshop {
  id: string;
  subjectId: string;
  subjectName: string;
  generatedDate: string;
  studentName: string;
  targetTopics: string[];
  durationEstimateMinutes: number;
  difficulty: DifficultyLevel;
  instructions: string;
  exercises: ExerciseItem[];
  conceptualSummary: string;
  recommendedTechniques: string[];
  materials: StudyMaterial[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  institution: string;
  career: string;
  semester: string;
  avatarSeed: string;
  isDemo?: boolean;
}

export interface GradeCalculationResult {
  currentAccumulated: number; // Puntos ponderados ganados hasta ahora (sobre escala total)
  completedPercentage: number; // Suma de porcentajes de cortes ya calificados
  remainingPercentage: number; // Porcentaje por calificar
  currentAverageOverCompleted: number; // Promedio aritmético ponderado de lo que lleva
  neededGradeToPass: number; // Requisito 4: Nota necesaria en lo restante para aprobar
  neededGradeToTarget: number; // Requisito 5: Nota necesaria para alcanzar la nota objetivo
  isPassedAlready: boolean; // ¿Ya tiene asegurada la aprobación?
  isUnattainableToPass: boolean; // Requisito 6: ¿Es imposible matemáticamente aprobar?
  isUnattainableToTarget: boolean; // ¿Es imposible matemáticamente alcanzar el objetivo?
  maxPossibleFinalGrade: number; // Si saca nota perfecta en todo lo restante
  minPossibleFinalGrade: number; // Si saca 0 en todo lo restante
}
