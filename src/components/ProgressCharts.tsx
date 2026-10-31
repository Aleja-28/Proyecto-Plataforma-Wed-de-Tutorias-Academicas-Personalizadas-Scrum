import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Award
} from 'lucide-react';
import { Subject, ThemeColorId, SubjectProgressAnalysis } from '../types';
import { calculateStudentProgressOverview, calculateAcademicSummary, formatGrade } from '../utils/gradeCalculations';
import { THEME_CONFIGS } from '../utils/themeConfig';

interface ProgressChartsProps {
  subjects: Subject[];
  analyses: SubjectProgressAnalysis[];
  currentTheme: ThemeColorId;
  onSelectSubject?: (subject: Subject) => void;
  onGenerateWorkshop?: (subject: Subject) => void;
}

const SUBJECT_PALETTE = [
  '#0284c7', // Sky
  '#7c3aed', // Violet
  '#059669', // Emerald
  '#d97706', // Amber
  '#e11d48', // Rose
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
  '#ea580c', // Orange
];

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  subjects,
  analyses,
  currentTheme,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'all' | 'trend' | 'bars' | 'distribution'>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{
    subjectName: string;
    cutName: string;
    grade: number;
    weight: number;
    delta: number | null;
    trend: string;
    x: number;
    y: number;
  } | null>(null);

  const themeConfig = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.sky;
  const overview = calculateStudentProgressOverview(subjects);
  const academicSummary = calculateAcademicSummary(subjects);

  const displayedAnalyses = selectedSubjectId === 'all'
    ? analyses
    : analyses.filter(a => a.subject.id === selectedSubjectId);

  const countAscenso = overview.countAscenso;
  const countRetroceso = overview.countRetroceso;
  const countEstable = analyses.filter(a => a.overallTrend === 'estable' || a.overallTrend === 'inicial').length;
  const totalAnalyzed = analyses.length || 1;

  const pctAscenso = Math.round((countAscenso / totalAnalyzed) * 100);
  const pctRetroceso = Math.round((countRetroceso / totalAnalyzed) * 100);
  const pctEstable = Math.round((countEstable / totalAnalyzed) * 100);

  const donutRadius = 46;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const strokeAscenso = (countAscenso / totalAnalyzed) * donutCircumference;
  const strokeRetroceso = (countRetroceso / totalAnalyzed) * donutCircumference;
  const strokeEstable = (countEstable / totalAnalyzed) * donutCircumference;

  const svgWidth = 650;
  const svgHeight = 280;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartAreaWidth = svgWidth - paddingLeft - paddingRight;
  const chartAreaHeight = svgHeight - paddingTop - paddingBottom;

  const getXCoord = (cutIndex: number, totalCuts: number) => {
    if (totalCuts <= 1) return paddingLeft + chartAreaWidth / 2;
    return paddingLeft + (cutIndex / (totalCuts - 1)) * chartAreaWidth;
  };

  const getYCoord = (grade: number) => {
    const clamped = Math.min(5, Math.max(0, grade));
    return paddingTop + chartAreaHeight - (clamped / 5.0) * chartAreaHeight;
  };

  const passingY = getYCoord(3.0);

  const gaugePercent = Math.min(100, Math.max(0, overview.overallSemesterProgressPercent));
  const gaugeRadius = 55;
  const gaugeCircumference = Math.PI * gaugeRadius;
  const gaugeStroke = (gaugePercent / 100) * gaugeCircumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span 
              className="p-1.5 rounded-xl text-white shadow-2xs"
              style={{ backgroundColor: themeConfig.primaryHex }}
            >
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Diagramas de Rendimiento y Evolución Académica
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Visualización gráfica en tiempo real: curvas de evolución por cortes, diagrama comparativo de barras, tacómetro de semestre y balance de ascensos vs retrocesos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 shrink-0">
          <button
            onClick={() => setActiveChartTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeChartTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos los Diagramas
          </button>
          <button
            onClick={() => setActiveChartTab('trend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeChartTab === 'trend'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📈 Evolución Temporal
          </button>
          <button
            onClick={() => setActiveChartTab('bars')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeChartTab === 'bars'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📶 Barras por Corte
          </button>
          <button
            onClick={() => setActiveChartTab('distribution')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeChartTab === 'distribution'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Estado & Tacómetro
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600">Enfocar materia:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="all">Todas las Materias ({analyses.length})</option>
            {analyses.map(a => (
              <option key={a.subject.id} value={a.subject.id}>
                {a.subject.name} {a.hasRegressed ? '⚠️ (Retroceso)' : a.overallTrend === 'ascenso' ? '▲ (Ascenso)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Ascenso / Subió</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Retroceso / Bajó</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-amber-500 inline-block" />
            <span>Umbral Mínimo (3.0)</span>
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {(activeChartTab === 'all' || activeChartTab === 'trend') && (
          <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  <span>Diagrama 1: Curva de Evolución Temporal de Calificaciones (Corte 1 → Corte 2 → Corte 3)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Muestra si la trayectoria de la nota sube o baja entre cortes. Pasa el cursor sobre los puntos para ver el cambio numérico exacto.
                </p>
              </div>

              {selectedSubjectId !== 'all' && (
                <button
                  onClick={() => setSelectedSubjectId('all')}
                  className="text-xs text-sky-600 font-bold hover:underline self-start sm:self-auto"
                >
                  Restablecer a todas
                </button>
              )}
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[580px] relative">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto overflow-visible select-none"
                >
                  {[0, 1.0, 2.0, 3.0, 4.0, 5.0].map((gradeLevel) => {
                    const y = getYCoord(gradeLevel);
                    const isPassing = gradeLevel === 3.0;

                    return (
                      <g key={gradeLevel}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={svgWidth - paddingRight}
                          y2={y}
                          stroke={isPassing ? '#f59e0b' : '#e2e8f0'}
                          strokeDasharray={isPassing ? '4,4' : 'none'}
                          strokeWidth={isPassing ? 1.5 : 1}
                        />
                        <text
                          x={paddingLeft - 8}
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          fontWeight={isPassing ? 'bold' : 'normal'}
                          fill={isPassing ? '#d97706' : '#94a3b8'}
                          className="font-mono"
                        >
                          {gradeLevel.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  <text
                    x={svgWidth - paddingRight + 5}
                    y={passingY + 3}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#d97706"
                  >
                    Meta Min (3.0)
                  </text>

                  {['Corte 1 (30%)', 'Corte 2 (30%)', 'Corte 3 (40%)'].map((corteLabel, idx) => {
                    const x = getXCoord(idx, 3);
                    return (
                      <g key={corteLabel}>
                        <line
                          x1={x}
                          y1={paddingTop}
                          x2={x}
                          y2={svgHeight - paddingBottom}
                          stroke="#cbd5e1"
                          strokeDasharray="2,2"
                          strokeWidth={1}
                        />
                        <text
                          x={x}
                          y={svgHeight - paddingBottom + 20}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="bold"
                          fill="#334155"
                        >
                          {corteLabel}
                        </text>
                      </g>
                    );
                  })}

                  {displayedAnalyses.map((analysis, subIdx) => {
                    const sub = analysis.subject;
                    const color = SUBJECT_PALETTE[subIdx % SUBJECT_PALETTE.length];
                    const cuts = analysis.cutsProgress;

                    const gradedPoints: { x: number; y: number; cut: typeof cuts[0]; cutIdx: number }[] = [];
                    cuts.forEach((cut, cutIdx) => {
                      if (cut.grade !== null) {
                        gradedPoints.push({
                          x: getXCoord(cutIdx, cuts.length),
                          y: getYCoord(cut.grade),
                          cut,
                          cutIdx,
                        });
                      }
                    });

                    if (gradedPoints.length === 0) return null;

                    const pathData = gradedPoints.reduce((acc, pt, i) => {
                      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
                    }, '');

                    const isSingleSelected = selectedSubjectId === sub.id;

                    return (
                      <g key={sub.id} className="transition-all duration-300">
                        {gradedPoints.length > 1 && (
                          <path
                            d={pathData}
                            fill="none"
                            stroke={color}
                            strokeWidth={isSingleSelected ? 3.5 : 2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={selectedSubjectId === 'all' || isSingleSelected ? 0.9 : 0.25}
                          />
                        )}

                        {gradedPoints.map((pt) => {
                          const isRegressed = pt.cut.trend === 'retroceso';
                          const isAscending = pt.cut.trend === 'ascenso';
                          const pointFill = isRegressed ? '#e11d48' : isAscending ? '#059669' : color;

                          return (
                            <g 
                              key={`${sub.id}-${pt.cutIdx}`}
                              className="cursor-pointer group"
                              onMouseEnter={() => {
                                setHoveredPoint({
                                  subjectName: sub.name,
                                  cutName: pt.cut.cutName,
                                  grade: pt.cut.grade || 0,
                                  weight: pt.cut.percentage,
                                  delta: pt.cut.deltaFromPrevious,
                                  trend: pt.cut.trend,
                                  x: pt.x,
                                  y: pt.y,
                                });
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                            >
                              {isRegressed && (
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="9"
                                  fill="#fecdd3"
                                  opacity="0.8"
                                  className="animate-ping"
                                />
                              )}

                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isRegressed ? 6.5 : 5.5}
                                fill="#ffffff"
                                stroke={pointFill}
                                strokeWidth={2.5}
                                className="transition-transform group-hover:scale-125"
                              />

                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={2.5}
                                fill={pointFill}
                              />

                              {(isSingleSelected || displayedAnalyses.length <= 2) && (
                                <text
                                  x={pt.x}
                                  y={pt.y - 10}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fontWeight="bold"
                                  fill={pointFill}
                                  className="font-mono bg-white"
                                >
                                  {formatGrade(pt.cut.grade || 0)}
                                  {pt.cut.deltaFromPrevious !== null && (
                                    <tspan fontSize="8" fill={isRegressed ? '#e11d48' : '#059669'}>
                                      {' '}({pt.cut.deltaFromPrevious > 0 ? `+${pt.cut.deltaFromPrevious.toFixed(1)}` : pt.cut.deltaFromPrevious.toFixed(1)})
                                    </tspan>
                                  )}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>

                {hoveredPoint && (
                  <div 
                    className="absolute z-20 pointer-events-none bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full border border-slate-700 max-w-xs"
                    style={{ 
                      left: `${(hoveredPoint.x / svgWidth) * 100}%`, 
                      top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                      marginTop: '-12px'
                    }}
                  >
                    <div className="font-extrabold text-slate-100 flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
                      <span>{hoveredPoint.subjectName}</span>
                      <span className="font-mono text-sky-400 font-bold">{formatGrade(hoveredPoint.grade)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>{hoveredPoint.cutName} ({hoveredPoint.weight}%)</span>
                      {hoveredPoint.delta !== null && (
                        <span className={`font-bold font-mono ${
                          hoveredPoint.delta > 0 ? 'text-emerald-400' : hoveredPoint.delta < 0 ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {hoveredPoint.delta > 0 ? `▲ +${hoveredPoint.delta.toFixed(1)}` : `▼ ${hoveredPoint.delta.toFixed(1)}`}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] pt-1">
                      {hoveredPoint.trend === 'retroceso' && (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" /> Disminución respecto al corte anterior
                        </span>
                      )}
                      {hoveredPoint.trend === 'ascenso' && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Progreso positivo en calificación
                        </span>
                      )}
                      {hoveredPoint.trend === 'estable' && (
                        <span className="text-slate-400 font-medium">
                          Rendimiento constante
                        </span>
                      )}
                      {hoveredPoint.trend === 'inicial' && (
                        <span className="text-slate-400 font-medium">
                          Primer corte registrado
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500">Materias en el diagrama:</span>
              {analyses.map((a, i) => {
                const color = SUBJECT_PALETTE[i % SUBJECT_PALETTE.length];
                const isSelected = selectedSubjectId === a.subject.id;

                return (
                  <button
                    key={a.subject.id}
                    onClick={() => setSelectedSubjectId(isSelected ? 'all' : a.subject.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate max-w-[140px]">{a.subject.name}</span>
                    {a.hasRegressed && (
                      <span className="text-[10px] text-rose-500 font-bold">📉</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(activeChartTab === 'all' || activeChartTab === 'bars') && (
          <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Diagrama 2: Comparativa de Barras Agrupadas (Corte 1 vs Corte 2 vs Corte 3)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Compara la nota alcanzada en cada corte de manera directa por cada materia. La línea punteada marca el umbral mínimo (3.0).
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded bg-sky-500" /> Corte 1 (30%)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded bg-indigo-500" /> Corte 2 (30%)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded bg-emerald-500" /> Corte 3 (40%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {displayedAnalyses.map(analysis => {
                const sub = analysis.subject;
                const cuts = analysis.cutsProgress;
                const cutColors = ['#0ea5e9', '#6366f1', '#10b981'];

                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="truncate">
                        <span className="text-xs font-extrabold text-slate-900 block truncate" title={sub.name}>
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {sub.code || 'Materia'} · {sub.credits} Créditos
                        </span>
                      </div>

                      {analysis.hasRegressed ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-md shrink-0 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" /> Retrocedió
                        </span>
                      ) : analysis.overallTrend === 'ascenso' ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md shrink-0 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Ascendió
                        </span>
                      ) : null}
                    </div>

                    <div className="relative pt-2">
                      <div 
                        className="absolute left-0 right-0 border-b border-dashed border-rose-400 z-10 pointer-events-none"
                        style={{ bottom: '26px', marginBottom: `${(3.0 / 5.0) * 110}px` }}
                      >
                        <span className="absolute right-0 -top-3.5 text-[9px] font-bold text-rose-500 bg-white/90 px-1 rounded">
                          3.0
                        </span>
                      </div>

                      <div className="h-36 flex items-end justify-around gap-3 px-2 pb-6 border-b border-slate-200">
                        {cuts.map((cutItem, cutIdx) => {
                          const grade = cutItem.grade;
                          const hasGrade = grade !== null;
                          const heightPct = hasGrade ? (Math.min(5, Math.max(0, grade)) / 5.0) * 100 : 0;
                          const barColor = cutColors[cutIdx % cutColors.length];

                          return (
                            <div 
                              key={`${sub.id}-${cutIdx}`} 
                              className="flex-1 flex flex-col items-center justify-end h-full group relative"
                            >
                              {hasGrade ? (
                                <span className={`text-[10px] font-mono font-bold mb-1 ${
                                  grade >= 3.0 ? 'text-slate-700' : 'text-rose-600'
                                }`}>
                                  {formatGrade(grade)}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-300 font-mono mb-1">
                                  —
                                </span>
                              )}

                              {hasGrade ? (
                                <div 
                                  className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-2xs relative"
                                  style={{ 
                                    height: `${Math.max(6, heightPct)}%`,
                                    backgroundColor: cutItem.trend === 'retroceso' ? '#f43f5e' : barColor
                                  }}
                                >
                                  {cutItem.trend === 'retroceso' && (
                                    <div className="absolute top-1 left-0 right-0 text-center text-white text-[8px] font-bold">
                                      ▼
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="w-full h-8 rounded-t-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[9px] text-slate-400 font-medium">
                                  Pend.
                                </div>
                              )}

                              <span className="text-[10px] font-bold text-slate-500 mt-2">
                                C{cutIdx + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs">
                        <span className="text-slate-500 font-medium">Promedio actual:</span>
                        <span className={`font-mono font-extrabold ${
                          analysis.currentAverage >= 3.0 ? 'text-slate-900' : 'text-rose-600'
                        }`}>
                          {formatGrade(analysis.currentAverage)} / 5.0
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(activeChartTab === 'all' || activeChartTab === 'distribution') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Diagrama 3: Tacómetro de Avance del Semestre</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mide el porcentaje completado del periodo académico según los cortes ya calificados y aprobados.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-48 h-28 flex items-end justify-center">
                  <svg viewBox="0 0 140 80" className="w-full h-full overflow-visible">
                    <path
                      d="M 15 75 A 55 55 0 0 1 125 75"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    <path
                      d="M 15 75 A 55 55 0 0 1 125 75"
                      fill="none"
                      stroke={themeConfig.primaryHex}
                      strokeWidth="14"
                      strokeDasharray={`${gaugeStroke} ${gaugeCircumference}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />

                    <text x="12" y="88" fontSize="8" fill="#94a3b8" textAnchor="middle">0%</text>
                    <text x="70" y="15" fontSize="8" fill="#94a3b8" textAnchor="middle">50%</text>
                    <text x="128" y="88" fontSize="8" fill="#94a3b8" textAnchor="middle">100%</text>
                  </svg>

                  <div className="absolute bottom-0 flex flex-col items-center text-center">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      {overview.overallSemesterProgressPercent}%
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Semestre Cursado
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-slate-200/60 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block">Cortes Evaluados</span>
                    <span className="text-sm font-bold font-mono text-slate-800">
                      {overview.totalGradedCutsCount} / {overview.totalCutsCount}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-medium block">Promedio General</span>
                    <span className="text-sm font-bold font-mono text-emerald-600">
                      {formatGrade(academicSummary.overallAverage)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>Diagrama 4: Distribución de Estado Académico</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Proporción de materias que van subiendo su rendimiento contra las que han sufrido retroceso.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                <div className="relative w-36 h-36 shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r={donutRadius}
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="16"
                    />

                    {countAscenso > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="16"
                        strokeDasharray={`${strokeAscenso} ${donutCircumference}`}
                        strokeDashoffset="0"
                        className="transition-all duration-700"
                      />
                    )}

                    {countRetroceso > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="16"
                        strokeDasharray={`${strokeRetroceso} ${donutCircumference}`}
                        strokeDashoffset={`-${strokeAscenso}`}
                        className="transition-all duration-700"
                      />
                    )}

                    {countEstable > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="16"
                        strokeDasharray={`${strokeEstable} ${donutCircumference}`}
                        strokeDashoffset={`-${strokeAscenso + strokeRetroceso}`}
                        className="transition-all duration-700"
                      />
                    )}
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-slate-900 font-mono">
                      {analyses.length}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      Materias
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs w-full sm:w-auto">
                  <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-emerald-100">
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      En Ascenso (Subieron)
                    </span>
                    <span className="font-bold font-mono text-emerald-700">
                      {countAscenso} ({pctAscenso}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-rose-100">
                    <span className="flex items-center gap-1.5 font-semibold text-rose-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Con Retroceso (Bajaron)
                    </span>
                    <span className="font-bold font-mono text-rose-700">
                      {countRetroceso} ({pctRetroceso}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                      Estables o Iniciales
                    </span>
                    <span className="font-bold font-mono text-slate-600">
                      {countEstable} ({pctEstable}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
