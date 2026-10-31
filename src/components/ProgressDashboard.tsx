import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Printer, 
  GraduationCap, 
  BarChart3,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Subject, ThemeColorId } from '../types';
import { calculateStudentProgressOverview } from '../utils/gradeCalculations';
import { THEME_CONFIGS } from '../utils/themeConfig';
import { ProgressCharts } from './ProgressCharts';

interface ProgressDashboardProps {
  subjects: Subject[];
  onOpenEditSubject: (subject: Subject) => void;
  onOpenTopics: (subject: Subject) => void;
  onGenerateWorkshop: (subject: Subject) => void;
  onOpenNewSubject: () => void;
  currentTheme: ThemeColorId;
  studentName: string;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  subjects,
  onOpenEditSubject,
  onOpenTopics,
  onGenerateWorkshop,
  onOpenNewSubject,
  currentTheme,
  studentName,
}) => {
  const [filterTrend, setFilterTrend] = useState<'todas' | 'retroceso' | 'ascenso' | 'riesgo'>('todas');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'ambos' | 'diagramas' | 'materias'>('ambos');

  const themeConfig = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.sky;
  const overview = calculateStudentProgressOverview(subjects);
  const activeAnalyses = overview.analyses;

  const filteredAnalyses = activeAnalyses.filter(a => {
    if (filterTrend === 'retroceso') return a.hasRegressed;
    if (filterTrend === 'ascenso') return a.overallTrend === 'ascenso';
    if (filterTrend === 'riesgo') return a.isUnattainableToPass || (!a.isPassedAlready && a.currentAverage < a.subject.minPassingGrade);
    return true;
  });

  const regressedSubjects = activeAnalyses.filter(a => a.hasRegressed);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: themeConfig.primaryHex }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider text-slate-400">Panel Académico</span>
              <span>·</span>
              <span className="font-semibold">{studentName}</span>
              <span>·</span>
              <span>Periodo 2026-1</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Avance del Estudiante & Monitoreo por Cortes
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Monitorea el progreso acumulado de tus materias, compara el rendimiento entre cortes (Corte 1 vs Corte 2 vs Corte 3) y detecta a tiempo si has <strong>avanzado</strong> o <strong>retrocedido</strong> en tus notas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
              title="Imprimir informe de avance"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimir Reporte</span>
            </button>

            <button
              onClick={onOpenNewSubject}
              className="px-4 py-2.5 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              style={{ backgroundColor: themeConfig.primaryHex }}
            >
              <BookOpen className="w-4 h-4" />
              <span>Añadir Materia</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Progreso del Semestre Cursado:</span>
              <strong className="text-slate-900 font-mono text-sm">{overview.overallSemesterProgressPercent}%</strong>
            </span>
            <span className="text-slate-500 font-medium">
              {overview.totalGradedCutsCount} de {overview.totalCutsCount} cortes calificados en {overview.totalSubjects} materias
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div 
              className="h-full rounded-full transition-all duration-700"
              style={{ 
                width: `${Math.min(100, Math.max(0, overview.overallSemesterProgressPercent))}%`,
                backgroundColor: themeConfig.primaryHex 
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Materias en Ascenso</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">
              {overview.countAscenso}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">
              {overview.countAscenso === 1 ? 'materia subió' : 'materias subieron'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Nota del último corte mayor a la anterior
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs transition-colors ${
          overview.countRetroceso > 0
            ? 'bg-rose-50/70 border-rose-200'
            : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${overview.countRetroceso > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
              Materias con Retroceso
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              overview.countRetroceso > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400'
            }`}>
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${
              overview.countRetroceso > 0 ? 'text-rose-600' : 'text-slate-700'
            }`}>
              {overview.countRetroceso}
            </span>
            <span className={`text-xs font-semibold ${overview.countRetroceso > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
              {overview.countRetroceso === 1 ? 'materia bajó' : 'materias bajaron'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Requiere taller o revisión de temas difíciles
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Cortes Evaluados</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {overview.totalGradedCutsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              de {overview.totalCutsCount} totales
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {overview.totalCutsCount - overview.totalGradedCutsCount} cortes restantes por cursar
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Desempeño Global</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {overview.countCritico === 0 ? 'Estable' : 'Alerta'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {overview.countCritico > 0 ? `${overview.countCritico} materias en riesgo crítico` : 'Sin materias en riesgo crítico'}
          </p>
        </div>
      </div>

      {regressedSubjects.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-300 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl shrink-0 mt-0.5">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-rose-950">
                  Detección de Retroceso en Evaluaciones ({regressedSubjects.length} {regressedSubjects.length === 1 ? 'materia' : 'materias'})
                </h3>
                <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-[10px] font-bold rounded-md uppercase">
                  Revisión Sugerida
                </span>
              </div>
              <p className="text-xs text-rose-800 max-w-3xl leading-relaxed">
                El sistema detectó que tu calificación disminuyó respecto al corte anterior. A continuación se detallan las materias afectadas y los temas vistos en ese corte para que generes talleres de refuerzo o solicites tutoría docente:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {regressedSubjects.map(analysis => {
              const sub = analysis.subject;
              return (
                <div 
                  key={sub.id}
                  className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">
                        {sub.name}
                      </span>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-md font-mono shrink-0">
                        {analysis.regressionAmount} pts
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      La nota bajó en <strong>{analysis.regressionCutName}</strong>. 
                      {sub.cuts.find(c => c.name === analysis.regressionCutName)?.topics.some(t => t.isDifficult) && (
                        <span className="text-rose-700 font-semibold block mt-0.5">
                          Temas difíciles identificados: {sub.cuts.find(c => c.name === analysis.regressionCutName)?.topics.filter(t => t.isDifficult).map(t => t.name).join(', ')}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onGenerateWorkshop(sub)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Generar Taller de Refuerzo</span>
                    </button>
                    <button
                      onClick={() => onOpenTopics(sub)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                    >
                      <span>Ver Temas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 px-2 shrink-0">Modo de visualización:</span>
          
          <button
            onClick={() => setViewMode('ambos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              viewMode === 'ambos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vista Completa (Diagramas + Materias)</span>
          </button>

          <button
            onClick={() => setViewMode('diagramas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              viewMode === 'diagramas'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-500" />
            <span>Solo Diagramas & Gráficos</span>
          </button>

          <button
            onClick={() => setViewMode('materias')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              viewMode === 'materias'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>Solo Detalle por Materias</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 px-2 hidden lg:block">
          Mostrando {activeAnalyses.length} materias analizadas
        </div>
      </div>

      {(viewMode === 'ambos' || viewMode === 'diagramas') && (
        <ProgressCharts
          subjects={subjects}
          analyses={activeAnalyses}
          currentTheme={currentTheme}
          onGenerateWorkshop={onGenerateWorkshop}
        />
      )}

      {(viewMode === 'ambos' || viewMode === 'materias') && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1">Filtrar materias:</span>
              {[
                { key: 'todas', label: `Todas (${activeAnalyses.length})` },
                { key: 'retroceso', label: `📉 Con Retroceso (${overview.countRetroceso})` },
                { key: 'ascenso', label: `📈 En Ascenso (${overview.countAscenso})` },
                { key: 'riesgo', label: `⚠️ En Riesgo (${overview.countCritico})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTrend(tab.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterTrend === tab.key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Subió
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block ml-2" /> Bajó / Retroceso
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block ml-2" /> Pendiente
            </div>
          </div>

          <div className="space-y-4">
            {filteredAnalyses.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No hay materias que coincidan con este filtro de tendencia.</p>
                <button
                  onClick={() => setFilterTrend('todas')}
                  className="text-xs font-semibold text-sky-600 hover:underline"
                >
                  Ver todas las materias
                </button>
              </div>
            ) : (
              filteredAnalyses.map(analysis => {
                const sub = analysis.subject;
                const isExpanded = expandedSubjectId === sub.id;

                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                  >
                    <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            {sub.name}
                          </h3>
                          {sub.code && (
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {sub.code}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            · {sub.credits} Créditos
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {sub.professor && <span>Docente: {sub.professor}</span>}
                          {sub.classroom && (
                            <>
                              <span>·</span>
                              <span>{sub.classroom}</span>
                            </>
                          )}
                          <span>·</span>
                          <span>Meta: <strong className="text-slate-800">{sub.targetGrade.toFixed(1)}</strong></span>
                          <span>·</span>
                          <span>Mínimo: <strong className="text-slate-800">{sub.minPassingGrade.toFixed(1)}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            Promedio Cursado
                          </span>
                          <span className="text-lg font-extrabold text-slate-900 font-mono">
                            {analysis.currentAverage > 0 ? analysis.currentAverage.toFixed(2) : '-.-'}
                          </span>
                        </div>

                        {analysis.hasRegressed ? (
                          <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-1.5 text-xs font-bold">
                            <TrendingDown className="w-4 h-4 text-rose-600" />
                            <span>Retrocedió ({analysis.regressionAmount} pts)</span>
                          </div>
                        ) : analysis.overallTrend === 'ascenso' ? (
                          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 flex items-center gap-1.5 text-xs font-bold">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span>Avanzó (+{analysis.lastDelta} pts)</span>
                          </div>
                        ) : analysis.gradedCutsCount === 1 ? (
                          <div className="px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-700 flex items-center gap-1.5 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-sky-600" />
                            <span>Primer Corte Registrado</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 flex items-center gap-1.5 text-xs font-bold">
                            <Minus className="w-4 h-4 text-slate-500" />
                            <span>Rendimiento Estable</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 bg-slate-50/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Evolución Corte por Corte</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Ponderación acumulada: <strong>{analysis.completedPercentage}%</strong> de 100%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {analysis.cutsProgress.map((cut) => {
                          const isGraded = cut.grade !== null && !isNaN(cut.grade);

                          return (
                            <div
                              key={cut.cutName}
                              className={`p-4 rounded-2xl border transition-all ${
                                isGraded
                                  ? cut.trend === 'retroceso'
                                    ? 'bg-rose-50/40 border-rose-200'
                                    : cut.trend === 'ascenso'
                                    ? 'bg-emerald-50/40 border-emerald-200'
                                    : 'bg-white border-slate-200'
                                  : 'bg-slate-100/60 border-dashed border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-2">
                                <span className="text-xs font-bold text-slate-800 line-clamp-1">
                                  {cut.cutName}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 font-mono">
                                  {cut.percentage}%
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between mb-2">
                                <div className="flex items-baseline gap-1.5">
                                  <span className={`text-2xl font-extrabold font-mono ${
                                    isGraded
                                      ? cut.grade! >= sub.minPassingGrade
                                        ? 'text-slate-900'
                                        : 'text-rose-600'
                                      : 'text-slate-400'
                                  }`}>
                                    {isGraded ? cut.grade!.toFixed(1) : '-.-'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">/ 5.0</span>
                                </div>

                                {cut.deltaFromPrevious !== null && (
                                  <div className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono flex items-center gap-0.5 ${
                                    cut.trend === 'ascenso'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : cut.trend === 'retroceso'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {cut.trend === 'ascenso' && '▲ +'}
                                    {cut.trend === 'retroceso' && '▼ '}
                                    {cut.trend === 'estable' && '▶ '}
                                    {cut.deltaFromPrevious.toFixed(1)}
                                  </div>
                                )}

                                {!isGraded && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                    Pendiente
                                  </span>
                                )}
                              </div>

                              <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/60">
                                <div className="flex items-center justify-between">
                                  <span className="capitalize">{cut.evaluationType}</span>
                                  <span>{cut.topicsCount} temas</span>
                                </div>

                                {cut.difficultTopicsCount > 0 && (
                                  <span className="text-amber-700 font-semibold block text-[10px]">
                                    {cut.difficultTopicsCount} {cut.difficultTopicsCount === 1 ? 'tema difícil' : 'temas difíciles'}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="text-slate-700">
                            {analysis.statusRecommendation}
                          </span>
                        </div>

                        {!analysis.isPassedAlready && analysis.neededToPass > 0 && (
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 shrink-0">
                            Necesitas {analysis.neededToPass.toFixed(1)} en lo restante para aprobar
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => setExpandedSubjectId(isExpanded ? null : sub.id)}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Ocultar detalles de temas' : 'Ver desglose de temas y notas'}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenTopics(sub)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all"
                          >
                            Gestionar Temas
                          </button>

                          <button
                            onClick={() => onGenerateWorkshop(sub)}
                            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-2xs flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generar Taller</span>
                          </button>

                          <button
                            onClick={() => onOpenEditSubject(sub)}
                            className="px-3 py-1.5 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                            style={{ backgroundColor: themeConfig.primaryHex }}
                          >
                            Editar Cortes
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-200 space-y-3 animate-in fade-in duration-200">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Temas Vistos y Nivel de Dificultad por Corte:
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {sub.cuts.map((c) => (
                              <div key={c.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                <span className="text-xs font-bold text-slate-800 block">
                                  {c.name} ({c.percentage}%)
                                </span>

                                {c.topics && c.topics.length > 0 ? (
                                  <ul className="space-y-1.5 text-[11px]">
                                    {c.topics.map(t => (
                                      <li key={t.id} className="flex items-start gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                                          t.isDifficult ? 'bg-rose-500' : 'bg-slate-300'
                                        }`} />
                                        <span className={t.isDifficult ? 'font-bold text-rose-900' : 'text-slate-600'}>
                                          {t.name}
                                          {t.isDifficult && ' (Difícil)'}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[11px] text-slate-400 italic">Sin temas registrados aún</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
