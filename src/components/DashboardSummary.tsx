import React from 'react';
import { 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  PlusCircle, 
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Subject } from '../types';
import { calculateAcademicSummary, calculateSubjectGrades } from '../utils/gradeCalculations';

interface DashboardSummaryProps {
  subjects: Subject[];
  onOpenNewSubject: () => void;
  selectedDifficultyFilter: string;
  onSelectDifficultyFilter: (diff: string) => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  subjects,
  onOpenNewSubject,
  selectedDifficultyFilter,
  onSelectDifficultyFilter,
}) => {
  const summary = calculateAcademicSummary(subjects);

  // Detectar materias con notas imposibles para la alerta superior (Requisito 6)
  const impossibleSubjects = subjects
    .filter(s => !s.isCompleted)
    .filter(s => {
      const calc = calculateSubjectGrades(s);
      return calc.isUnattainableToPass;
    });

  return (
    <div className="space-y-6">
      {/* Alerta Destacada de Nota Imposible de Alcanzar (Requisito 6) */}
      {impossibleSubjects.length > 0 && (
        <div 
          id="unattainable-grades-banner"
          className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-rose-900 flex items-center gap-2">
                <span>¡Atención Crítica! Nota matemáticamente imposible de alcanzar</span>
                <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-xs rounded-full font-extrabold">
                  {impossibleSubjects.length} {impossibleSubjects.length === 1 ? 'materia' : 'materias'}
                </span>
              </h3>
              <p className="text-xs text-rose-700 mt-1 max-w-2xl leading-relaxed">
                En {impossibleSubjects.map(s => s.name).join(', ')}, la nota requerida en los cortes restantes supera la escala máxima permitida. Te recomendamos programar tutorías urgentes con el docente, solicitar trabajos de nivelación extraordinaria o revisar fechas de cancelación académica.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto shrink-0">
            <span className="inline-block text-xs font-bold text-rose-800 bg-rose-200/80 px-3 py-1.5 rounded-lg border border-rose-300">
              Requiere Asesoría Docente
            </span>
          </div>
        </div>
      )}

      {/* Tarjetas de Métricas del Resumen General (Requisito 14) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Promedio General */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-sky-600 mb-2">
            <span className="text-xs font-semibold text-slate-500">Promedio Ponderado</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summary.overallAverage > 0 ? summary.overallAverage.toFixed(2) : '-.-'}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Basado en {summary.totalActive} materias en curso
          </p>
        </div>

        {/* Materias en Riesgo */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition-colors ${
          summary.subjectsInRisk > 0 
            ? 'bg-amber-50/70 border-amber-200' 
            : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-semibold text-slate-600">Materias en Riesgo</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              summary.subjectsInRisk > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold ${
              summary.subjectsInRisk > 0 ? 'text-amber-700' : 'text-slate-800'
            }`}>
              {summary.subjectsInRisk}
            </span>
            <span className="text-xs text-slate-500 font-medium">requieren atención</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Genera talleres de refuerzo
          </p>
        </div>

        {/* Materias Aprobadas / Encaminadas */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold text-slate-500">Aprobación Asegurada</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summary.subjectsPassed}
            </span>
            <span className="text-xs text-slate-400 font-medium">de {summary.totalActive}</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            {summary.subjectsAtTarget} alcanzando nota objetivo
          </p>
        </div>

        {/* Total Créditos */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-sky-600 mb-2">
            <span className="text-xs font-semibold text-slate-500">Carga Académica</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {summary.totalCredits}
            </span>
            <span className="text-xs text-slate-400 font-medium">créditos</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Semestre académico en curso
          </p>
        </div>
      </div>

      {/* Barra de Filtros y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Filtrar por dificultad:</span>
          {[
            { key: 'todas', label: 'Todas' },
            { key: 'baja', label: 'Baja' },
            { key: 'media', label: 'Media' },
            { key: 'alta', label: 'Alta' },
            { key: 'critica', label: 'Crítica' },
          ].map((item) => (
            <button
              key={item.key}
              id={`filter-diff-${item.key}-btn`}
              onClick={() => onSelectDifficultyFilter(item.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDifficultyFilter === item.key
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          id="dashboard-new-subject-btn"
          onClick={onOpenNewSubject}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-slate-900" />
          <span>Registrar Nueva Materia</span>
        </button>
      </div>
    </div>
  );
};
