import React, { useState } from 'react';
import { 
  X, 
  ListChecks, 
  Plus, 
  Trash2, 
  Flame, 
  Sparkles, 
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Subject, Cut, Topic } from '../types';

interface TopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject;
  onSaveTopics: (updatedSubject: Subject) => void;
  onGenerateWorkshop: (subject: Subject) => void;
}

export const TopicsModal: React.FC<TopicsModalProps> = ({
  isOpen,
  onClose,
  subject,
  onSaveTopics,
  onGenerateWorkshop,
}) => {
  const [selectedCutId, setSelectedCutId] = useState<string>(
    subject.cuts[0]?.id || ''
  );
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDifficult, setNewTopicDifficult] = useState(false);
  const [newTopicNotes, setNewTopicNotes] = useState('');
  const [newConceptTag, setNewConceptTag] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentCut = subject.cuts.find(c => c.id === selectedCutId) || subject.cuts[0];

  const handleAddTag = () => {
    if (newConceptTag.trim() && !currentTags.includes(newConceptTag.trim())) {
      setCurrentTags([...currentTags, newConceptTag.trim()]);
      setNewConceptTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(t => t !== tagToRemove));
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim() || !currentCut) return;

    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      name: newTopicName.trim(),
      isDifficult: newTopicDifficult,
      notes: newTopicNotes.trim() || undefined,
      keyConcepts: currentTags.length > 0 ? currentTags : undefined,
    };

    const updatedCuts = subject.cuts.map(c => {
      if (c.id === currentCut.id) {
        return {
          ...c,
          topics: [...(c.topics || []), newTopic]
        };
      }
      return c;
    });

    const updatedSubject: Subject = {
      ...subject,
      cuts: updatedCuts,
    };

    onSaveTopics(updatedSubject);
    setNewTopicName('');
    setNewTopicDifficult(false);
    setNewTopicNotes('');
    setCurrentTags([]);
  };

  const handleToggleDifficulty = (topicId: string) => {
    const updatedCuts = subject.cuts.map(c => {
      if (c.id === currentCut.id) {
        return {
          ...c,
          topics: (c.topics || []).map(t => {
            if (t.id === topicId) {
              return { ...t, isDifficult: !t.isDifficult };
            }
            return t;
          })
        };
      }
      return c;
    });

    onSaveTopics({ ...subject, cuts: updatedCuts });
  };

  const handleDeleteTopic = (topicId: string) => {
    const updatedCuts = subject.cuts.map(c => {
      if (c.id === currentCut.id) {
        return {
          ...c,
          topics: (c.topics || []).filter(t => t.id !== topicId)
        };
      }
      return c;
    });

    onSaveTopics({ ...subject, cuts: updatedCuts });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="topics-modal-card"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-5 sm:p-6 text-white shrink-0 relative">
          <button
            id="close-topics-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Temas Vistos por Corte & Dificultades
              </h2>
              <p className="text-xs text-sky-100">
                {subject.name} ({subject.code || 'Asignatura'})
              </p>
            </div>
          </div>

          {/* Selector de Corte */}
          <div className="flex flex-wrap gap-2 mt-4">
            {subject.cuts.map(cut => (
              <button
                key={cut.id}
                onClick={() => setSelectedCutId(cut.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCutId === cut.id
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'bg-sky-600/60 text-white hover:bg-sky-600'
                }`}
              >
                {cut.name} ({cut.percentage}%)
                <span className="ml-1.5 px-1.5 py-0.2 bg-black/10 rounded-full text-[10px]">
                  {(cut.topics || []).length} temas
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto grow">
          {/* Formulario para Registrar Nuevo Tema */}
          <form onSubmit={handleAddTopic} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Registrar tema visto en {currentCut?.name}
              </span>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs">
                <input
                  type="checkbox"
                  checked={newTopicDifficult}
                  onChange={(e) => setNewTopicDifficult(e.target.checked)}
                  className="rounded-sm text-amber-500 focus:ring-amber-400"
                />
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Marcar como tema de mayor dificultad</span>
              </label>
            </div>

            <div>
              <input
                id="new-topic-name-input"
                type="text"
                required
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Nombre del tema (ej: Límites indeterminados, Regla de la cadena...)"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <input
                type="text"
                value={newTopicNotes}
                onChange={(e) => setNewTopicNotes(e.target.value)}
                placeholder="Notas de dificultad o dudas (ej: 'Me confundo al operar fracciones algebraicas con raíces')"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Conceptos clave opcionales */}
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newConceptTag}
                  onChange={(e) => setNewConceptTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Añadir concepto clave (ej: 'Teorema de Rolle', presiona enter o añadir)"
                  className="grow px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Añadir
                </button>
              </div>

              {currentTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-800 text-[11px] rounded-md font-medium">
                      <span>{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-sky-600 hover:text-sky-900">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Guardar Tema en {currentCut?.name}</span>
              </button>
            </div>
          </form>

          {/* Listado de Temas Registrados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Temas del {currentCut?.name} ({(currentCut?.topics || []).length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Haz clic en la llama para alternar si es de mayor dificultad
              </span>
            </div>

            {(!currentCut?.topics || currentCut.topics.length === 0) ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  No hay temas registrados para este corte aún
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Escribe los temas vistos en clase arriba para generar talleres personalizados
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentCut.topics.map(topic => (
                  <div
                    key={topic.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      topic.isDifficult 
                        ? 'bg-amber-50/70 border-amber-300 shadow-2xs' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="space-y-1 grow">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {topic.name}
                        </span>
                        {topic.isDifficult && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-extrabold">
                            <Flame className="w-3 h-3 text-amber-700" />
                            Mayor Dificultad (Refuerzo prioritario)
                          </span>
                        )}
                      </div>

                      {topic.notes && (
                        <p className="text-xs text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-100">
                          <strong>Observación:</strong> {topic.notes}
                        </p>
                      )}

                      {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {topic.keyConcepts.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px]">
                              #{c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Toggle dificultad */}
                      <button
                        type="button"
                        onClick={() => handleToggleDifficulty(topic.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          topic.isDifficult
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                        title={topic.isDifficult ? 'Quitar marca de dificultad' : 'Marcar como mayor dificultad'}
                      >
                        <Flame className="w-4 h-4" />
                      </button>

                      {/* Borrar tema */}
                      <button
                        type="button"
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Eliminar tema"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500">
            Los temas de mayor dificultad se integran automáticamente en los talleres de refuerzo.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onGenerateWorkshop(subject);
              }}
              className="w-full sm:w-auto px-5 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Generar Taller de Refuerzo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
