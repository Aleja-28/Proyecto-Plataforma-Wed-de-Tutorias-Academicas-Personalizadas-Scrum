import React, { useState } from 'react';
import { 
  Subject, 
  DifficultyLevel, 
  EvaluationType 
} from '../types';
import { calculateSubjectGrades } from '../utils/gradeCalculations';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  FileDown, 
  Edit3, 
  Trash2, 
  ListChecks, 
  Flame, 
  BookOpen, 
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => Promise<void> | void;
  onManageTopics: (subject: Subject) => void;
  onGenerateWorkshop: (subject: Subject) => void;
}

const difficultyBadgeConfig: Record<DifficultyLevel, { label: string; bg: string; text: string; border: string }> = {
  baja: { label: 'Dificultad Baja', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  media: { label: 'Dificultad Media', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  alta: { label: 'Dificultad Alta', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  critica: { label: 'Dificultad Crítica', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

const evaluationTypeLabels: Record<EvaluationType, { label: string; bg: string; text: string }> = {
  parcial: { label: 'Examen Parcial', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  taller: { label: 'Taller Práctico', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  proyecto: { label: 'Proyecto / Software', bg: 'bg-purple-50', text: 'text-purple-700' },
  quices: { label: 'Quices & Tareas', bg: 'bg-amber-50', text: 'text-amber-700' },
  laboratorio: { label: 'Práctica Laboratorio', bg: 'bg-cyan-50', text: 'text-cyan-700' },
  exposicion: { label: 'Exposición Oral', bg: 'bg-pink-50', text: 'text-pink-700' },
  mixto: { label: 'Evaluación Mixta', bg: 'bg-slate-100', text: 'text-slate-700' },
};

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onEdit,
  onDelete,
  onManageTopics,
  onGenerateWorkshop,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showCutsDetails, setShowCutsDetails] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const calc = calculateSubjectGrades(subject);
  const diffConfig = difficultyBadgeConfig[subject.difficulty] || difficultyBadgeConfig.media;

  // Recuento de temas registrados y temas difíciles (Requisito 7 & 8)
  let totalTopicsCount = 0;
  let difficultTopicsCount = 0;
  const difficultTopicNames: string[] = [];

  subject.cuts.forEach(c => {
    (c.topics || []).forEach(t => {
      totalTopicsCount++;
      if (t.isDifficult) {
        difficultTopicsCount++;
        difficultTopicNames.push(t.name);
      }
    });
  });

  return (
    <div 
      id={`subject-card-${subject.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Badge de Nivel de Dificultad (Requisito 15) */}
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${diffConfig.bg} ${diffConfig.text} ${diffConfig.border}`}>
                {diffConfig.label}
              </span>
              
              {subject.code && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {subject.code}
                </span>
              )}

              <span className="text-[11px] text-slate-400 font-medium">
                {subject.credits} {subject.credits === 1 ? 'Crédito' : 'Créditos'}
              </span>
            </div>

            {/* Acciones de Edición y Eliminación (Requisito 11 y 12) */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                id={`edit-subject-${subject.id}-btn`}
                onClick={() => onEdit(subject)}
                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                title="Editar materia y notas"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                id={`delete-subject-${subject.id}-btn`}
                onClick={() => setShowConfirmDelete(true)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Eliminar materia"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            {subject.name}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
            {subject.professor && <span>Prof: {subject.professor}</span>}
            {subject.classroom && <span>{subject.classroom}</span>}
            <span>Meta Objetivo: <strong className="text-amber-600">{subject.targetGrade.toFixed(1)}</strong></span>
          </div>
        </div>

        {/* Requisito 6: Alerta Prominente de Nota Imposible de Alcanzar */}
        {calc.isUnattainableToPass && (
          <div className="mx-5 sm:mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-extrabold uppercase tracking-wide text-rose-900">
                ¡Advertencia: Nota Inalcanzable para Aprobar!
              </p>
              <p className="mt-0.5 text-rose-700 leading-relaxed">
                Requieres una nota de <strong className="underline decoration-rose-500 text-rose-900 font-bold">{calc.neededGradeToPass.toFixed(2)}</strong> en el porcentaje restante ({calc.remainingPercentage}%), pero la nota máxima de la materia es <strong className="text-rose-900">{subject.scaleMax.toFixed(1)}</strong>.
              </p>
              <p className="mt-1 font-semibold text-rose-800">
                Sugerencia: Solicita tutoría intensiva urgente o consulta con tu docente la posibilidad de trabajos extraordinarios de nivelación.
              </p>
            </div>
          </div>
        )}

        {/* Alerta Secundaria: Nota imposible para alcanzar el Objetivo pero sí pasa */}
        {!calc.isUnattainableToPass && calc.isUnattainableToTarget && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Objetivo de {subject.targetGrade.toFixed(1)} no alcanzable:</span>{' '}
              <span>Necesitarías {calc.neededGradeToTarget.toFixed(2)} sobre {subject.scaleMax.toFixed(1)}. Tu nota final máxima posible es <strong>{calc.maxPossibleFinalGrade.toFixed(2)}</strong>.</span>
            </div>
          </div>
        )}

        {/* Panel de Diagnóstico Numérico (Requisitos 3, 4 y 5) */}
        <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/70 border-b border-slate-100">
          {/* Acumulado Actual */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Puntaje Acumulado ({calc.completedPercentage}%)
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-slate-800">
                {calc.currentAccumulated.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {subject.scaleMax.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Promedio parcial: {calc.currentAverageOverCompleted.toFixed(2)}
            </span>
          </div>

          {/* Requisito 4: Nota Necesaria para Aprobar */}
          <div className={`p-3 rounded-xl border shadow-2xs ${
            calc.isPassedAlready 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : calc.isUnattainableToPass
              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
              : 'bg-sky-50/80 border-sky-200 text-sky-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold block">
                Para Pasar ({subject.minPassingGrade.toFixed(1)})
              </span>
              {calc.isPassedAlready ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Target className="w-3.5 h-3.5 text-sky-600" />
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              {calc.isPassedAlready ? (
                <span className="text-sm font-extrabold text-emerald-700 py-1">
                  ¡Aprobada! 🎉
                </span>
              ) : calc.remainingPercentage === 0 ? (
                <span className="text-sm font-bold text-slate-600 py-1">
                  100% Calificado
                </span>
              ) : (
                <>
                  <span className={`text-xl font-extrabold ${calc.isUnattainableToPass ? 'text-rose-700' : 'text-sky-700'}`}>
                    {calc.neededGradeToPass.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    en {calc.remainingPercentage}% restante
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">
              {calc.isPassedAlready ? 'Puntaje mínimo asegurado' : 'Mínimo en lo que falta'}
            </span>
          </div>

          {/* Requisito 5: Nota Necesaria para Objetivo */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Meta ({subject.targetGrade.toFixed(1)})
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              {calc.currentAccumulated >= subject.targetGrade ? (
                <span className="text-sm font-extrabold text-amber-600 py-1">
                  ¡Meta Lograda!
                </span>
              ) : calc.remainingPercentage === 0 ? (
                <span className="text-sm font-bold text-slate-600 py-1">
                  Cierre Final
                </span>
              ) : calc.isUnattainableToTarget ? (
                <span className="text-xs font-bold text-amber-700 py-1">
                  No alcanzable ({calc.neededGradeToTarget.toFixed(1)})
                </span>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-amber-700">
                    {calc.neededGradeToTarget.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    necesaria
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block">
              Máx posible: {calc.maxPossibleFinalGrade.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Desglose de Cortes y Tipos de Evaluación (Requisitos 3 y 17) */}
        <div className="p-5 sm:p-6 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cortes Cursados & Evaluaciones
            </h4>
            <button
              onClick={() => setShowCutsDetails(!showCutsDetails)}
              className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              <span>{showCutsDetails ? 'Ocultar cortes' : 'Ver cortes'}</span>
              {showCutsDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showCutsDetails && (
            <div className="space-y-2.5">
              {subject.cuts.map((cut, idx) => {
                const isRated = cut.grade !== null && cut.grade !== undefined;
                const evalType = evaluationTypeLabels[cut.evaluationType] || evaluationTypeLabels.parcial;

                return (
                  <div 
                    key={cut.id || idx}
                    className={`p-3 rounded-xl border transition-all ${
                      isRated 
                        ? 'bg-white border-slate-200' 
                        : 'bg-sky-50/40 border-sky-100 border-dashed'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {cut.name} ({cut.percentage}%)
                        </span>
                        {/* Requisito 17: Registrar tipo de evaluación por corte */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${evalType.bg} ${evalType.text}`}>
                          {evalType.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isRated ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-slate-500">Nota:</span>
                            <span className={`text-sm font-extrabold ${
                              (cut.grade || 0) >= subject.minPassingGrade 
                                ? 'text-slate-900' 
                                : 'text-rose-600'
                            }`}>
                              {(cut.grade || 0).toFixed(1)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (+{(((cut.grade || 0) * cut.percentage) / 100).toFixed(2)} pts)
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-sky-600 bg-sky-100/70 px-2 py-0.5 rounded-md">
                            Pendiente por cursar
                          </span>
                        )}
                      </div>
                    </div>

                    {cut.evaluationDetails && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        {cut.evaluationDetails}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Requisito 7 & 8: Temas vistos por corte e indicación de tema de mayor dificultad */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-sky-500" />
                <span className="font-semibold text-slate-700">
                  Temas registrados: <strong>{totalTopicsCount}</strong>
                </span>
              </div>

              {difficultTopicsCount > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  {difficultTopicsCount} de alta dificultad
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Sin temas críticos marcados
                </span>
              )}
            </div>

            {/* Listado de temas difíciles si existen */}
            {difficultTopicNames.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {difficultTopicNames.slice(0, 3).map((name, i) => (
                  <span 
                    key={i} 
                    className="inline-block px-2 py-0.5 bg-amber-100/80 text-amber-900 rounded-md text-[10px] font-medium truncate max-w-[200px]"
                    title={name}
                  >
                    ⚠ {name}
                  </span>
                ))}
                {difficultTopicNames.length > 3 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{difficultTopicNames.length - 3} más
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones de Acción: Temas y Generar Taller de Refuerzo (Requisitos 8, 9, 10, 16) */}
      <div className="p-5 sm:p-6 pt-2 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
        <button
          id={`manage-topics-btn-${subject.id}`}
          onClick={() => onManageTopics(subject)}
          className="w-full sm:w-1/2 py-2.5 px-3 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <BookOpen className="w-4 h-4 text-sky-500" />
          <span>Temas & Dificultad</span>
        </button>

        <button
          id={`generate-workshop-btn-${subject.id}`}
          onClick={() => onGenerateWorkshop(subject)}
          className="w-full sm:w-1/2 py-2.5 px-3 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Taller de Refuerzo (PDF)</span>
        </button>
      </div>

      {/* Modal de confirmación para eliminar materia (Requisito 12) */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                ¿Eliminar {subject.name}?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Esta acción borrará la materia, sus cortes registrados, temas de dificultad y talleres asociados.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                id={`confirm-delete-${subject.id}-btn`}
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await onDelete(subject.id);
                  } finally {
                    setIsDeleting(false);
                    setShowConfirmDelete(false);
                  }
                }}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-400 text-white shadow-xs flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Eliminando de Supabase...</span>
                  </>
                ) : (
                  <span>Sí, Eliminar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
