import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  Percent,
  Award,
  Database,
  Loader2
} from 'lucide-react';
import { 
  Subject, 
  DifficultyLevel, 
  EvaluationType, 
  Cut 
} from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Subject) => Promise<void> | void;
  initialSubject?: Subject | null;
}

const defaultCuts: Cut[] = [
  {
    id: 'cut-1',
    name: 'Corte 1',
    percentage: 30,
    grade: null,
    evaluationType: 'parcial',
    evaluationDetails: 'Examen parcial escrito',
    topics: []
  },
  {
    id: 'cut-2',
    name: 'Corte 2',
    percentage: 30,
    grade: null,
    evaluationType: 'taller',
    evaluationDetails: 'Talleres + Quices',
    topics: []
  },
  {
    id: 'cut-3',
    name: 'Corte 3',
    percentage: 40,
    grade: null,
    evaluationType: 'parcial',
    evaluationDetails: 'Examen final integrador',
    topics: []
  }
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSubject,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [professor, setProfessor] = useState('');
  const [classroom, setClassroom] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('media');
  const [scaleMax, setScaleMax] = useState<number>(5.0);
  const [minPassingGrade, setMinPassingGrade] = useState<number>(3.0);
  const [targetGrade, setTargetGrade] = useState<number>(4.0);
  const [notes, setNotes] = useState('');
  const [cuts, setCuts] = useState<Cut[]>(defaultCuts);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (initialSubject) {
      setName(initialSubject.name || '');
      setCode(initialSubject.code || '');
      setCredits(initialSubject.credits || 3);
      setProfessor(initialSubject.professor || '');
      setClassroom(initialSubject.classroom || '');
      setDifficulty(initialSubject.difficulty || 'media');
      setScaleMax(initialSubject.scaleMax || 5.0);
      setMinPassingGrade(initialSubject.minPassingGrade || 3.0);
      setTargetGrade(initialSubject.targetGrade || 4.0);
      setNotes(initialSubject.notes || '');
      setCuts(initialSubject.cuts && initialSubject.cuts.length > 0 
        ? JSON.parse(JSON.stringify(initialSubject.cuts)) 
        : defaultCuts
      );
    } else {
      setName('');
      setCode('');
      setCredits(3);
      setProfessor('');
      setClassroom('');
      setDifficulty('media');
      setScaleMax(5.0);
      setMinPassingGrade(3.0);
      setTargetGrade(4.0);
      setNotes('');
      setCuts(JSON.parse(JSON.stringify(defaultCuts)));
    }
  }, [initialSubject, isOpen]);

  if (!isOpen) return null;

  const totalPercentage = cuts.reduce((acc, c) => acc + (Number(c.percentage) || 0), 0);
  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.1;

  const handleCutChange = (index: number, field: keyof Cut, value: any) => {
    const updated = [...cuts];
    updated[index] = { ...updated[index], [field]: value };
    setCuts(updated);
  };

  const handleAddCut = () => {
    const newCutIndex = cuts.length + 1;
    const newCut: Cut = {
      id: `cut-${Date.now()}`,
      name: `Corte ${newCutIndex}`,
      percentage: 20,
      grade: null,
      evaluationType: 'parcial',
      evaluationDetails: '',
      topics: []
    };
    setCuts([...cuts, newCut]);
  };

  const handleRemoveCut = (index: number) => {
    if (cuts.length <= 1) return;
    const updated = cuts.filter((_, i) => i !== index);
    setCuts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaveError(null);
    setIsSaving(true);

    const subjectToSave: Subject = {
      id: initialSubject ? initialSubject.id : `sub-${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase() || undefined,
      credits: Number(credits) || 1,
      professor: professor.trim() || undefined,
      classroom: classroom.trim() || undefined,
      difficulty,
      scaleMax: Number(scaleMax) || 5.0,
      minPassingGrade: Number(minPassingGrade) || 3.0,
      targetGrade: Number(targetGrade) || 4.0,
      cuts,
      isCompleted: initialSubject?.isCompleted || false,
      finalGrade: initialSubject?.finalGrade,
      semesterPeriod: initialSubject?.semesterPeriod || '2026-1',
      notes: notes.trim() || undefined,
    };

    try {
      await onSave(subjectToSave);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setSaveError(err?.message || 'Error al guardar la materia');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="subject-form-card"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Cabecera modal en azul clarito y amarillo */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-5 sm:p-6 text-white shrink-0 relative">
          <button
            id="close-subject-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {initialSubject ? 'Editar Materia y Cortes' : 'Registrar Nueva Materia'}
              </h2>
              <p className="text-xs text-sky-100">
                Configura ponderaciones, tipos de evaluación, nota objetivo y nivel de dificultad
              </p>
            </div>
          </div>
        </div>

        {/* Cuerpo del formulario con scroll */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto grow">
          {/* Información General */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Datos Principales de la Asignatura
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de la Materia *
                </label>
                <input
                  id="subject-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Cálculo Diferencial e Integral"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código Asignatura
                </label>
                <input
                  id="subject-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ej: MAT-201"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Créditos Académicos
                </label>
                <input
                  id="subject-credits-input"
                  type="number"
                  min="1"
                  max="12"
                  value={credits}
                  onChange={(e) => setCredits(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Docente / Profesor
                </label>
                <input
                  id="subject-professor-input"
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="Ej: Dr. Alejandro Morales"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aula / Horario
                </label>
                <input
                  id="subject-classroom-input"
                  type="text"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  placeholder="Ej: Edif. 401 Aula 302"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Requisito 15: Nivel de Dificultad */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-700">
              Nivel de Dificultad Estimado (Requisito 15)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'baja', label: 'Baja', color: 'peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-800' },
                { id: 'media', label: 'Media', color: 'peer-checked:bg-sky-50 peer-checked:border-sky-500 peer-checked:text-sky-800' },
                { id: 'alta', label: 'Alta', color: 'peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-800' },
                { id: 'critica', label: 'Crítica', color: 'peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-800' },
              ].map((diff) => (
                <label key={diff.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty-selector"
                    value={diff.id}
                    checked={difficulty === diff.id}
                    onChange={() => setDifficulty(diff.id as DifficultyLevel)}
                    className="sr-only peer"
                  />
                  <div className={`p-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 text-slate-600 transition-all ${diff.color}`}>
                    {diff.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Requisito 4 y 5: Escala y Notas Objetivos */}
          <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-3">
            <div className="flex items-center gap-2 text-sky-800">
              <Award className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Escala de Calificación & Metas
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Escala Máxima
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  value={scaleMax}
                  onChange={(e) => setScaleMax(parseFloat(e.target.value) || 5.0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-400">Estándar: 5.0</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nota Mínima para Aprobar
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={scaleMax}
                  value={minPassingGrade}
                  onChange={(e) => setMinPassingGrade(parseFloat(e.target.value) || 3.0)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-[10px] text-slate-400">Estándar: 3.0</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nota Objetivo Deseada (Requisito 5)
                </label>
                <input
                  id="subject-target-grade-input"
                  type="number"
                  step="0.1"
                  min={minPassingGrade}
                  max={scaleMax}
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 4.0)}
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs font-extrabold text-amber-900"
                />
                <span className="text-[10px] text-amber-700 font-medium">Meta para calcular</span>
              </div>
            </div>
          </div>

          {/* Requisitos 3 y 17: Cortes, Porcentajes, Notas Obtenidas y Tipos de Evaluación */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>Cortes Cursados & Evaluaciones</span>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    isPercentageValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    Total: {totalPercentage}% {isPercentageValid ? '✓' : '(Debe sumar 100%)'}
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={handleAddCut}
                className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 py-1 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Corte</span>
              </button>
            </div>

            <div className="space-y-3">
              {cuts.map((cut, index) => (
                <div 
                  key={cut.id || index}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                    {/* Nombre del corte */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={cut.name}
                        onChange={(e) => handleCutChange(index, 'name', e.target.value)}
                        placeholder="Ej: Corte 1"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>

                    {/* Porcentaje */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Peso %
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={cut.percentage}
                          onChange={(e) => handleCutChange(index, 'percentage', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Requisito 17: Tipo de Evaluación */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Tipo de Evaluación (Req 17)
                      </label>
                      <select
                        value={cut.evaluationType}
                        onChange={(e) => handleCutChange(index, 'evaluationType', e.target.value as EvaluationType)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      >
                        <option value="parcial">Examen Parcial</option>
                        <option value="taller">Taller Práctico</option>
                        <option value="proyecto">Proyecto / Software</option>
                        <option value="quices">Quices & Tareas</option>
                        <option value="laboratorio">Laboratorio</option>
                        <option value="exposicion">Exposición Oral</option>
                        <option value="mixto">Mixto</option>
                      </select>
                    </div>

                    {/* Nota obtenida (o vacía si no se ha cursado) */}
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Nota Obtenida
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max={scaleMax}
                        value={cut.grade !== null && cut.grade !== undefined ? cut.grade : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseFloat(e.target.value);
                          handleCutChange(index, 'grade', val);
                        }}
                        placeholder="Sin calificar"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* Botón borrar corte */}
                    <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                      {cuts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCut(index)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar este corte"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detalle evaluativo */}
                  <div>
                    <input
                      type="text"
                      value={cut.evaluationDetails || ''}
                      onChange={(e) => handleCutChange(index, 'evaluationDetails', e.target.value)}
                      placeholder="Detalles opcionales (ej: 'Examen escrito 70% + 2 Quices virtuales 30%')"
                      className="w-full px-2.5 py-1 bg-white/70 border border-slate-200/70 rounded-lg text-[11px] text-slate-600 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {saveError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Database className="w-3.5 h-3.5 text-sky-600" />
              <span>
                {supabaseConfigured ? 'Sincronización en Supabase activa' : 'Guardado local (Configura Supabase en .env)'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancelar
              </button>
              <button
                id="save-subject-submit-btn"
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-300 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Guardando en Supabase...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{initialSubject ? 'Guardar Cambios' : 'Registrar Materia'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
