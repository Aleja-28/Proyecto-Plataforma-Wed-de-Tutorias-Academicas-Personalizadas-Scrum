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

export type ThemeColorId = 'sky' | 'emerald' | 'violet' | 'indigo' | 'amber' | 'rose' | 'teal';

export type TrendType = 'ascenso' | 'retroceso' | 'estable' | 'inicial';

export interface CutProgress {
  cutIndex: number;
  cutName: string;
  percentage: number;
  grade: number | null;
  evaluationType: EvaluationType;
  evaluationDetails?: string;
  deltaFromPrevious: number | null; // Diferencia respecto al corte anterior (+0.4 o -0.4)
  trend: TrendType; // ascenso, retroceso, estable, inicial
  topicsCount: number;
  difficultTopicsCount: number;
}

export interface SubjectProgressAnalysis {
  subject: Subject;
  completedPercentage: number;
  gradedCutsCount: number;
  totalCutsCount: number;
  overallTrend: TrendType;
  lastDelta: number | null;
  cutsProgress: CutProgress[];
  hasRegressed: boolean; // ¿El estudiante retrocedió en algún corte?
  regressionCutName?: string;
  regressionAmount?: number;
  currentAccumulated: number;
  currentAverage: number;
  isPassedAlready: boolean;
  isUnattainableToPass: boolean;
  neededToPass: number;
  neededToTarget: number;
  statusRecommendation: string;
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
  themePreference?: ThemeColorId;
}

export interface GradeCalculationResult {
  currentAccumulated: number;
  completedPercentage: number;
  remainingPercentage: number;
  currentAverageOverCompleted: number;
  neededGradeToPass: number;
  neededGradeToTarget: number;
  isPassedAlready: boolean;
  isUnattainableToPass: boolean;
  isUnattainableToTarget: boolean;
  maxPossibleFinalGrade: number;
  minPossibleFinalGrade: number;
}
