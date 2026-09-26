import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileDown, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Clock, 
  Award, 
  ExternalLink,
  Download,
  FileText,
  Lightbulb,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Subject, Workshop, ExerciseItem } from '../types';
import { generateCustomWorkshop } from '../utils/workshopGenerator';
import { exportWorkshopToPDF } from '../utils/pdfExport';
import { calculateSubjectGrades } from '../utils/gradeCalculations';

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  studentName: string;
}

export const WorkshopModal: React.FC<WorkshopModalProps> = ({
  isOpen,
  onClose,
  subject,
  studentName,
}) => {
  const [activeTab, setActiveTab] = useState<'exercises' | 'materials'>('exercises');
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const workshop: Workshop = generateCustomWorkshop(subject, studentName);
  const calc = calculateSubjectGrades(subject);

  const toggleHint = (id: string) => {
    setRevealedHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportPDF = () => {
    setIsDownloading(true);
    try {
      exportWorkshopToPDF(workshop, subject);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0ea5e9', '#f59e0b', '#38bdf8', '#fef08a']
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="workshop-modal-card"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header con colores de la plataforma (Azul clarito y Amarillo) */}
        <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 p-5 sm:p-6 text-white shrink-0 relative">
          <button
            id="close-workshop-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md text-white">
                  Taller de Refuerzo Personalizado
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  {subject.name}
                </h2>
                <p className="text-xs text-sky-100">
                  Estudiante: <strong>{studentName}</strong> | Dificultad: {subject.difficulty.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Requisito 16: Botón de Exportar a PDF */}
            <button
              id="export-workshop-pdf-btn"
              onClick={handleExportPDF}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
            >
              <FileDown className="w-4 h-4 text-slate-950" />
              <span>{isDownloading ? 'Generando PDF...' : 'Exportar Taller en PDF'}</span>
            </button>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex bg-sky-600/50 p-1 rounded-xl mt-5">
            <button
              id="workshop-tab-exercises"
              onClick={() => setActiveTab('exercises')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'exercises'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ejercicios & Problemas ({workshop.exercises.length})</span>
            </button>

            <button
              id="workshop-tab-materials"
              onClick={() => setActiveTab('materials')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'materials'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Materiales de Refuerzo & Guías ({workshop.materials.length})</span>
            </button>
          </div>
        </div>

        {/* Resumen pedagógico del estudiante */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-5 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Temas prioritarios de mayor dificultad:</strong>{' '}
              {workshop.targetTopics.length > 0 ? workshop.targetTopics.join(', ') : 'Conceptos clave de la asignatura'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-500 font-medium">Nota requerida:</span>
            <span className="font-extrabold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
              {calc.isPassedAlready ? 'Aprobada' : `${calc.neededGradeToPass.toFixed(2)} pts`}
            </span>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto grow space-y-6">
          {activeTab === 'exercises' ? (
            /* Lista de ejercicios interactivos (Requisito 9) */
            <div className="space-y-4">
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 leading-relaxed">
                <strong>Instrucciones de Tutoría:</strong> {workshop.instructions}
              </div>

              <div className="space-y-3.5">
                {workshop.exercises.map((ex, index) => {
                  const hasHint = revealedHints[ex.id];
                  const hasSolution = revealedSolutions[ex.id];

                  return (
                    <div 
                      key={ex.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-extrabold">
                              {index + 1}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900">
                              {ex.topicName}
                            </h4>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          ex.difficulty === 'básico' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : ex.difficulty === 'intermedio'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          Nivel {ex.difficulty}
                        </span>
                      </div>

                      {/* Pregunta */}
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pl-8">
                        {ex.question}
                      </p>

                      {/* Botones de Pistas y Solucionario */}
                      <div className="pl-8 pt-1 flex flex-wrap items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => toggleHint(ex.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200/80 transition-colors"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>{hasHint ? 'Ocultar Pista' : 'Ver Pista Pedagógica'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleSolution(ex.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{hasSolution ? 'Ocultar Solución' : 'Ver Solución Guiada'}</span>
                        </button>
                      </div>

                      {/* Desplegable de Pista */}
                      {hasHint && (
                        <div className="ml-8 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                          <strong>💡 Pista de tu tutor:</strong> {ex.hint}
                        </div>
                      )}

                      {/* Desplegable de Solución */}
                      {hasSolution && (
                        <div className="ml-8 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                          <strong>Esquema de Solución:</strong> {ex.sampleSolution}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Material de Refuerzo (Requisito 10) */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workshop.materials.map((mat) => (
                  <div 
                    key={mat.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                            {mat.type === 'video' ? <Video className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                            {mat.type === 'video' ? 'Video-Clase' : mat.type === 'formula' ? 'Formulario' : 'Guía de Estudio'}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                        {mat.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {mat.description}
                      </p>

                      <ul className="space-y-1.5 text-xs text-slate-700 mb-4">
                        {mat.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Material verificado por tutores
                      </span>
                      <button
                        onClick={handleExportPDF}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Técnicas de Estudio Recomendadas */}
              <div className="p-5 bg-sky-50/70 rounded-2xl border border-sky-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-2.5 flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-600" />
                  <span>Metodología de Estudio & Preparación de Examen</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  {workshop.recommendedTechniques.map((tech, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-sky-100/80 shadow-2xs">
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500">
            Taller generado con base en tus notas actuales y temas difíciles registrados.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Cerrar
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full sm:w-auto px-5 py-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-950" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
