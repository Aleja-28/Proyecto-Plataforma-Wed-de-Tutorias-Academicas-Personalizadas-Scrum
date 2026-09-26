import React from 'react';
import { Subject } from '../types';
import { 
  History, 
  Award, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Calendar, 
  ArrowLeft, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface HistoryViewProps {
  subjects: Subject[];
  onBackToDashboard: () => void;
  onOpenNewSubject: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  subjects,
  onBackToDashboard,
  onOpenNewSubject,
}) => {
  const historySubjects = subjects.filter(s => s.isCompleted);
  
  const totalCompletedCredits = historySubjects.reduce((acc, s) => acc + s.credits, 0);
  const passedCount = historySubjects.filter(s => (s.finalGrade || 0) >= s.minPassingGrade).length;
  const failedCount = historySubjects.length - passedCount;

  let totalWeighted = 0;
  historySubjects.forEach(s => {
    totalWeighted += (s.finalGrade || 0) * s.credits;
  });
  const historicalGPA = totalCompletedCredits > 0 ? (totalWeighted / totalCompletedCredits) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Mis Materias Activas</span>
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-sky-500" />
            <span>Historial Académico & Resultados (Requisito 13)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registro de asignaturas concluidas en periodos académicos anteriores y calificaciones definitivas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewSubject}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Añadir Registro al Historial
          </button>
        </div>
      </div>

      {/* Métricas Históricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Promedio Histórico</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              {historicalGPA > 0 ? historicalGPA.toFixed(2) : '-.-'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Ponderado por créditos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Materias Aprobadas</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600">
              {passedCount}
            </span>
            <span className="text-xs text-slate-400">asignaturas</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Éxito académico</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Materias Reprobadas</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-slate-800">
              {failedCount}
            </span>
            <span className="text-xs text-slate-400">materias</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Historial acumulado</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Créditos Aprobados</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              {totalCompletedCredits}
            </span>
            <span className="text-xs text-slate-400">créditos</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Avance de carrera</span>
        </div>
      </div>

      {/* Tabla / Lista de Materias Históricas */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Registro Detallado de Calificaciones Definitivas
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {historySubjects.length} materias registradas
          </span>
        </div>

        {historySubjects.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No tienes materias marcadas en el historial aún.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {historySubjects.map(sub => {
              const isPassed = (sub.finalGrade || 0) >= sub.minPassingGrade;

              return (
                <div key={sub.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {sub.name}
                      </span>
                      {sub.code && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                          {sub.code}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        ({sub.credits} créditos)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Periodo: {sub.semesterPeriod}</span>
                      </span>
                      {sub.professor && <span>Docente: {sub.professor}</span>}
                    </div>
                  </div>

                  {/* Nota Final y Estado */}
                  <div className="flex items-center gap-4 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Nota Definitiva
                      </span>
                      <span className={`text-xl font-extrabold ${isPassed ? 'text-slate-900' : 'text-rose-600'}`}>
                        {sub.finalGrade ? sub.finalGrade.toFixed(1) : '-.-'}
                      </span>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      isPassed 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {isPassed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Aprobada</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Reprobada</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
