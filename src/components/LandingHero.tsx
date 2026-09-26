import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  AlertTriangle, 
  FileDown, 
  CheckCircle2, 
  ArrowRight, 
  BrainCircuit, 
  Award,
  Layers,
  HelpCircle,
  Clock,
  Flame
} from 'lucide-react';

interface LandingHeroProps {
  onGoToDashboard: () => void;
  onOpenAuth: () => void;
  onGoToSimulator: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onGoToDashboard,
  onOpenAuth,
  onGoToSimulator,
}) => {
  // Mini calculadora interactiva en vivo en la landing
  const [demoCorte1, setDemoCorte1] = useState<number>(2.5);
  const [demoCorte2, setDemoCorte2] = useState<number>(3.0);
  const [demoTarget, setDemoTarget] = useState<number>(3.0);

  // Supuesto: Corte 1 (30%), Corte 2 (30%), Corte 3 (40%)
  const currentAcc = (demoCorte1 * 0.3) + (demoCorte2 * 0.3);
  const needed = (demoTarget - currentAcc) / 0.4;
  const isImpossible = needed > 5.0;

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Principal */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Luces de fondo sutiles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-100/50 via-amber-50/30 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70" />

        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tutorías Académicas & Gestión Inteligente de Notas</span>
          </div>

          {/* Título de impacto */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Pasa tus materias con certeza.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-600">
              Calcula tu nota exacta
            </span>{' '}
            y refuerza lo difícil.
          </h1>

          {/* Descripción con buen espacio en blanco */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            Nuestra plataforma académica calcula en segundos cuánto necesitas sacar en los cortes restantes, te alerta a tiempo si una nota está matemáticamente en riesgo y genera talleres de refuerzo personalizados con exportación a PDF para los temas que más te cuestan.
          </p>

          {/* Botones de acción principal */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="landing-hero-cta-dashboard"
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-7 py-3.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Acceder al Panel de Materias</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="landing-hero-cta-auth"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Registrar Perfil Gratis</span>
            </button>

            <button
              id="landing-hero-cta-simulator"
              onClick={onGoToSimulator}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-sky-500" />
              <span>Simulador Rápido</span>
            </button>
          </div>

          {/* Micro credenciales */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cortes configurables (30%, 35%, 40%)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Talleres en PDF listos para imprimir
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Alerta de notas imposibles
            </span>
          </div>
        </div>
      </section>

      {/* Widget Interactivo de Demostración en la Landing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xl shadow-sky-100/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                Demostración Interactiva
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Calcula cuánto necesitas en el último corte
              </h2>
              <p className="text-xs text-slate-500">
                Ponderación estándar: Corte 1 (30%) + Corte 2 (30%) + Corte 3 (40%)
              </p>
            </div>
            
            <div className="bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Escala estándar: 0.0 a 5.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {/* Input Corte 1 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Nota Corte 1 (30%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={demoCorte1}
                  onChange={(e) => setDemoCorte1(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <span className="w-12 text-center py-1 bg-sky-50 text-sky-800 font-extrabold text-sm rounded-lg border border-sky-200">
                  {demoCorte1.toFixed(1)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Aporta {(demoCorte1 * 0.3).toFixed(2)} pts</p>
            </div>

            {/* Input Corte 2 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Nota Corte 2 (30%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={demoCorte2}
                  onChange={(e) => setDemoCorte2(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <span className="w-12 text-center py-1 bg-sky-50 text-sky-800 font-extrabold text-sm rounded-lg border border-sky-200">
                  {demoCorte2.toFixed(1)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Aporta {(demoCorte2 * 0.3).toFixed(2)} pts</p>
            </div>

            {/* Nota objetivo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Nota Objetivo deseada
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="3.0"
                  max="5.0"
                  step="0.1"
                  value={demoTarget}
                  onChange={(e) => setDemoTarget(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="w-12 text-center py-1 bg-amber-50 text-amber-800 font-extrabold text-sm rounded-lg border border-amber-200">
                  {demoTarget.toFixed(1)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Aprobatoria mínima: 3.0</p>
            </div>
          </div>

          {/* Resultado de la demo interactiva */}
          <div className="mt-2 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Puntaje acumulado actual (60% cursado):</p>
              <p className="text-xl font-extrabold text-slate-800">
                {currentAcc.toFixed(2)} <span className="text-xs font-medium text-slate-400">/ 5.0</span>
              </p>
            </div>

            {/* Caja de nota necesaria o advertencia */}
            <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3.5 ${
              isImpossible 
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : needed <= 0
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-gradient-to-r from-sky-50 to-amber-50 border-sky-200 text-slate-900'
            }`}>
              {isImpossible ? (
                <>
                  <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                      ¡Nota Imposible de Alcanzar!
                    </p>
                    <p className="text-sm font-semibold">
                      Necesitas {needed.toFixed(2)} pero el tope es 5.0. Se requiere tutoría de rescate o plan de habilitación.
                    </p>
                  </div>
                </>
              ) : needed <= 0 ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                      ¡Materia ya aprobada!
                    </p>
                    <p className="text-sm font-semibold">
                      Ya alcanzaste los {demoTarget.toFixed(1)} puntos necesarios.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {needed.toFixed(1)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Necesitas sacar en el Corte 3 (40%):
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Mínimo <span className="text-sky-600 font-extrabold">{needed.toFixed(2)}</span> para obtener tu meta de {demoTarget.toFixed(1)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Características Principales */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-md border border-amber-200/80">
            Funcionalidades Diseñadas Para Estudiantes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Todo lo que necesitas para no perder ninguna materia
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Metodología pedagógica estructurada que une cálculos matemáticos con refuerzo activo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 font-bold">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Cálculo Matemático Preciso
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingresa tus cortes cursados con sus porcentajes y tipos de evaluación (parcial, quices, laboratorio). El sistema calcula la nota mínima requerida para aprobar y para tu nota objetivo.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Alerta de Nota Imposible
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Si matemáticamente necesitas más que la nota máxima (ej: 5.2 sobre 5.0), el sistema te avisa inmediatamente y te brinda recomendaciones de asesoría docente antes de finalizar el semestre.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 font-bold">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Temas de Mayor Dificultad
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Registra los temas vistos por cada corte y marca con un solo clic los conceptos que más se te dificultan para priorizar el tiempo de estudio en lo que realmente necesitas.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-bold">
              <FileDown className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Talleres de Refuerzo en PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Genera con un clic un taller estructurado por niveles (Básico, Intermedio y Avanzado) enfocado en tus temas débiles y descárgalo en formato PDF membretado listo para imprimir.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Material Didáctico Curado
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accede a guías conceptuales, resúmenes clave, formularios y enlaces a videos explicativos recomendados por tutores para dominar los temas antes del parcial.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Resumen General & Historial
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visualiza en tiempo real tu promedio ponderado acumulado, créditos cursados, materias en riesgo y el registro histórico de periodos académicos anteriores.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final de la landing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
              Comienza hoy mismo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Toma el control de tus calificaciones este semestre
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              No esperes al último examen para descubrir que no te alcanza la nota. Registra tus materias y prepara tus talleres de refuerzo ahora.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={onGoToDashboard}
                className="px-6 py-3 bg-white text-sky-600 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                Abrir Mi Panel de Materias
              </button>
              <button
                onClick={onOpenAuth}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
              >
                Registrar Usuario
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
