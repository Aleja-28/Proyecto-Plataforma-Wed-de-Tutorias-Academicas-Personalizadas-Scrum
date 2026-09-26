import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Target, 
  Plus, 
  Trash2, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { Subject, Cut } from '../types';

interface SimulatorViewProps {
  existingSubjects: Subject[];
  onSelectSubjectToLoad: (subject: Subject) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  existingSubjects,
}) => {
  const [scaleMax, setScaleMax] = useState<number>(5.0);
  const [minPassingGrade, setMinPassingGrade] = useState<number>(3.0);
  const [targetGrade, setTargetGrade] = useState<number>(4.2);

  const [cuts, setCuts] = useState<Array<{ name: string; percentage: number; grade: number | null }>>([
    { name: 'Corte 1', percentage: 30, grade: 2.8 },
    { name: 'Corte 2', percentage: 30, grade: 3.1 },
    { name: 'Corte 3', percentage: 40, grade: null },
  ]);

  // Cálculos en tiempo real
  let accumulated = 0;
  let completedWeight = 0;

  cuts.forEach(c => {
    if (c.grade !== null && !isNaN(c.grade)) {
      accumulated += (c.grade * c.percentage) / 100;
      completedWeight += c.percentage;
    }
  });

  const remainingWeight = Math.max(0, 100 - completedWeight);
  const remainingFraction = remainingWeight / 100;

  let neededToPass = 0;
  let neededToTarget = 0;

  if (remainingFraction > 0) {
    neededToPass = (minPassingGrade - accumulated) / remainingFraction;
    neededToTarget = (targetGrade - accumulated) / remainingFraction;
  }

  const isPassedAlready = accumulated >= minPassingGrade;
  const isImpossibleToPass = !isPassedAlready && (neededToPass > scaleMax);
  const isImpossibleToTarget = neededToTarget > scaleMax;
  const maxPossibleGrade = Math.min(scaleMax, accumulated + (remainingFraction * scaleMax));

  const totalPercentage = cuts.reduce((acc, c) => acc + (c.percentage || 0), 0);

  const handleUpdateGrade = (index: number, val: string) => {
    const updated = [...cuts];
    updated[index].grade = val === '' ? null : parseFloat(val);
    setCuts(updated);
  };

  const handleUpdatePercentage = (index: number, val: number) => {
    const updated = [...cuts];
    updated[index].percentage = val;
    setCuts(updated);
  };

  const handleLoadSubject = (subjectId: string) => {
    const found = existingSubjects.find(s => s.id === subjectId);
    if (found) {
      setScaleMax(found.scaleMax);
      setMinPassingGrade(found.minPassingGrade);
      setTargetGrade(found.targetGrade);
      setCuts(found.cuts.map(c => ({
        name: c.name,
        percentage: c.percentage,
        grade: c.grade,
      })));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Calculator className="w-6 h-6 text-sky-500" />
          <span>Simulador Libre de Calificaciones & Cortes</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Experimenta con diferentes combinaciones de notas y porcentajes para saber exactamente qué necesitas en el examen final
        </p>
      </div>

      {/* Cargar datos de materia existente si el estudiante desea */}
      {existingSubjects.length > 0 && (
        <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-sky-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span>¿Deseas simular una materia que ya tienes inscrita?</span>
          </span>
          <select
            onChange={(e) => e.target.value && handleLoadSubject(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-sky-800 shadow-2xs"
            defaultValue=""
          >
            <option value="" disabled>Selecciona una materia para cargar...</option>
            {existingSubjects.filter(s => !s.isCompleted).map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.cuts.length} cortes)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Requisito 6: Alerta Prominente si es imposible */}
      {isImpossibleToPass && (
        <div className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-900 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-extrabold text-rose-900 uppercase tracking-wide">
              ¡Nota Matemáticamente Imposible de Alcanzar! (Requisito 6)
            </h4>
            <p className="text-rose-700 leading-relaxed">
              Con las calificaciones actuales necesitas sacar <strong className="underline font-extrabold">{neededToPass.toFixed(2)}</strong> en el {remainingWeight}% restante, pero la escala máxima es de <strong>{scaleMax.toFixed(1)}</strong>. Tu nota máxima alcanzable es de <strong>{maxPossibleGrade.toFixed(2)}</strong>.
            </p>
            <p className="font-semibold text-rose-800">
              Consejo de la plataforma: Programa tutorías de rescate intensivas y revisa con tu profesor posibles bonificaciones o planes de nivelación.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Parámetros y Cortes */}
        <div className="lg:col-span-2 space-y-5">
          {/* Metas y Escala */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              <span>Configuración de Escala y Objetivos</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Escala Máxima
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={scaleMax}
                  onChange={(e) => setScaleMax(parseFloat(e.target.value) || 5.0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nota Mínima Aprobatoria
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={minPassingGrade}
                  onChange={(e) => setMinPassingGrade(parseFloat(e.target.value) || 3.0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nota Objetivo Deseada
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 4.0)}
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs font-extrabold text-amber-900"
                />
              </div>
            </div>
          </div>

          {/* Cortes para simular */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Ponderaciones & Notas de Cortes ({totalPercentage}%)
              </h3>
              <button
                onClick={() => setCuts([...cuts, { name: `Corte ${cuts.length + 1}`, percentage: 20, grade: null }])}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Corte</span>
              </button>
            </div>

            <div className="space-y-3">
              {cuts.map((cut, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <input
                    type="text"
                    value={cut.name}
                    onChange={(e) => {
                      const updated = [...cuts];
                      updated[idx].name = e.target.value;
                      setCuts(updated);
                    }}
                    className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  />

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={cut.percentage}
                      onChange={(e) => handleUpdatePercentage(idx, parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 text-center"
                    />
                    <span className="text-xs text-slate-400 font-bold">%</span>
                  </div>

                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={scaleMax}
                      placeholder="Sin cursar (Pendiente)"
                      value={cut.grade !== null ? cut.grade : ''}
                      onChange={(e) => handleUpdateGrade(idx, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  {cuts.length > 1 && (
                    <button
                      onClick={() => setCuts(cuts.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Diagnóstico y Resultados */}
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-sky-500 to-sky-600 p-6 rounded-3xl text-white shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
                Diagnóstico en Vivo
              </span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>

            {/* Puntos acumulados */}
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-xs text-sky-100 block">Puntaje Ganado ({completedWeight}% cursado)</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-white">
                  {accumulated.toFixed(2)}
                </span>
                <span className="text-xs text-sky-200">/ {scaleMax.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-sky-200 block mt-1">
                Faltan por evaluar: {remainingWeight}%
              </span>
            </div>

            {/* Nota requerida para pasar */}
            <div className="bg-white p-4 rounded-2xl text-slate-900 shadow-md">
              <span className="text-xs font-bold text-slate-500 block">
                Para Aprobar con {minPassingGrade.toFixed(1)}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                {isPassedAlready ? (
                  <span className="text-lg font-extrabold text-emerald-600">
                    ¡Ya la Aprobaste! 🎉
                  </span>
                ) : remainingWeight === 0 ? (
                  <span className="text-sm font-bold text-slate-700">
                    Corte finalizado
                  </span>
                ) : (
                  <>
                    <span className={`text-3xl font-extrabold ${isImpossibleToPass ? 'text-rose-600' : 'text-sky-600'}`}>
                      {neededToPass.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      en el {remainingWeight}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Nota requerida para Objetivo */}
            <div className="bg-amber-400 p-4 rounded-2xl text-slate-950 shadow-md">
              <span className="text-xs font-bold text-slate-800 block">
                Para Lograr Meta de {targetGrade.toFixed(1)}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                {accumulated >= targetGrade ? (
                  <span className="text-base font-extrabold text-slate-950">
                    ¡Meta Conseguida! 🏆
                  </span>
                ) : remainingWeight === 0 ? (
                  <span className="text-xs font-bold text-slate-800">
                    Semestre terminado
                  </span>
                ) : isImpossibleToTarget ? (
                  <span className="text-xs font-bold text-slate-900">
                    Inalcanzable (Requiere {neededToTarget.toFixed(2)})
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-extrabold text-slate-950">
                      {neededToTarget.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-800 font-medium">
                      en lo restante
                    </span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-slate-800 block mt-1">
                Máxima nota posible: {maxPossibleGrade.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
