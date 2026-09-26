/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { initialSubjects, initialUser } from './data/initialData';
import { Subject, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardSummary } from './components/DashboardSummary';
import { SubjectCard } from './components/SubjectCard';
import { SubjectModal } from './components/SubjectModal';
import { TopicsModal } from './components/TopicsModal';
import { WorkshopModal } from './components/WorkshopModal';
import { HistoryView } from './components/HistoryView';
import { SimulatorView } from './components/SimulatorView';
import { AuthModal } from './components/AuthModal';
import { SupabaseInfoModal } from './components/SupabaseInfoModal';
import { calculateAcademicSummary } from './utils/gradeCalculations';
import { 
  BookOpen, 
  PlusCircle, 
  GraduationCap, 
  CheckCircle2, 
  Database, 
  RefreshCw,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  fetchSubjectsFromSupabase, 
  upsertSubjectInSupabase, 
  deleteSubjectFromSupabase, 
  saveProfileInSupabase,
  fetchProfileFromSupabase 
} from './lib/supabase';

export default function App() {
  // Estado de Materias con persistencia local como caché resiliente
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('tutorias_subjects');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('No se pudo cargar de localStorage', e);
    }
    return initialSubjects;
  });

  // Estado del Perfil de Usuario
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('tutorias_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('No se pudo cargar perfil de localStorage', e);
    }
    return initialUser;
  });

  // Navegación de vistas
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'history' | 'simulator'>('dashboard');

  // Filtro de dificultad
  const [difficultyFilter, setDifficultyFilter] = useState<string>('todas');

  // Modales
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [topicsModalSubject, setTopicsModalSubject] = useState<Subject | null>(null);
  const [workshopModalSubject, setWorkshopModalSubject] = useState<Subject | null>(null);

  // Estados de sincronización con Supabase
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const supabaseConnected = isSupabaseConfigured();

  // Función para mostrar mensajes flotantes
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSyncToast({ message, type });
    setTimeout(() => {
      setSyncToast(null);
    }, 4000);
  };

  // Cargar datos desde Supabase al iniciar si está configurado
  const loadDataFromSupabase = useCallback(async (currentLocalSubjects: Subject[], currentLocalUser: UserProfile) => {
    if (!isSupabaseConfigured()) return;

    setIsSyncing(true);
    try {
      // 1. Obtener perfil de Supabase si existe
      if (currentLocalUser.id) {
        const { data: cloudProfile } = await fetchProfileFromSupabase(currentLocalUser.id);
        if (cloudProfile) {
          setUser(cloudProfile);
          localStorage.setItem('tutorias_user', JSON.stringify(cloudProfile));
        }
      }

      // 2. Obtener materias de Supabase
      const { data: cloudSubjects, error } = await fetchSubjectsFromSupabase(currentLocalUser.id);
      
      if (error) {
        console.warn('Aviso al consultar Supabase:', error);
      } else if (cloudSubjects && cloudSubjects.length > 0) {
        setSubjects(cloudSubjects);
        localStorage.setItem('tutorias_subjects', JSON.stringify(cloudSubjects));
        showToast('¡Materias sincronizadas exitosamente desde Supabase!', 'success');
      } else if (cloudSubjects && cloudSubjects.length === 0 && currentLocalSubjects.length > 0) {
        // La tabla está vacía en Supabase: subir materias locales para no perderlas
        for (const sub of currentLocalSubjects) {
          await upsertSubjectInSupabase(sub, currentLocalUser.id);
        }
        showToast('Materias locales migradas a tu base de datos Supabase.', 'info');
      }
    } catch (err: any) {
      console.warn('Error en sincronización inicial:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Efecto de inicialización de Supabase
  useEffect(() => {
    loadDataFromSupabase(subjects, user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar en localStorage como caché
  useEffect(() => {
    try {
      localStorage.setItem('tutorias_subjects', JSON.stringify(subjects));
    } catch (e) {
      console.warn('Error saving subjects to localStorage', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem('tutorias_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Error saving user to localStorage', e);
    }
  }, [user]);

  // Sincronización manual bajo demanda
  const handleSyncNow = async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseModalOpen(true);
      return;
    }
    setIsSyncing(true);
    await loadDataFromSupabase(subjects, user);
    setIsSyncing(false);
  };

  // Cálculos de métricas globales
  const summary = calculateAcademicSummary(subjects);

  // Materias activas filtradas
  const activeSubjects = subjects.filter(s => !s.isCompleted);
  const filteredActiveSubjects = activeSubjects.filter(s => {
    if (difficultyFilter === 'todas') return true;
    return s.difficulty === difficultyFilter;
  });

  // Acciones CRUD con Supabase (Requisitos 2, 11, 12)
  const handleSaveSubject = async (subjectToSave: Subject) => {
    // 1. Actualización optimista en React
    setSubjects(prev => {
      const existsIndex = prev.findIndex(s => s.id === subjectToSave.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = subjectToSave;
        return updated;
      } else {
        return [subjectToSave, ...prev];
      }
    });

    // 2. Guardar en Supabase si está activo
    if (isSupabaseConfigured()) {
      const { success, error } = await upsertSubjectInSupabase(subjectToSave, user.id);
      if (success) {
        showToast(`Materia "${subjectToSave.name}" guardada en Supabase.`, 'success');
      } else {
        showToast(`Guardada localmente. Aviso de Supabase: ${error}`, 'error');
      }
    } else {
      showToast(`Materia "${subjectToSave.name}" guardada en memoria local.`, 'info');
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    const subjectToDelete = subjects.find(s => s.id === subjectId);
    const subjectName = subjectToDelete ? subjectToDelete.name : 'Materia';

    // 1. Actualización optimista en React
    setSubjects(prev => prev.filter(s => s.id !== subjectId));

    // 2. Eliminar de Supabase
    if (isSupabaseConfigured()) {
      const { success, error } = await deleteSubjectFromSupabase(subjectId);
      if (success) {
        showToast(`Materia "${subjectName}" eliminada de Supabase.`, 'success');
      } else {
        showToast(`Eliminada localmente. Aviso de Supabase: ${error}`, 'error');
      }
    } else {
      showToast(`Materia "${subjectName}" eliminada.`, 'info');
    }
  };

  const handleUpdateSubjectTopics = async (updatedSubject: Subject) => {
    await handleSaveSubject(updatedSubject);
    setTopicsModalSubject(updatedSubject);
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    if (isSupabaseConfigured()) {
      const { success, error } = await saveProfileInSupabase(updatedProfile);
      if (success) {
        showToast('Perfil actualizado y sincronizado en Supabase.', 'success');
      } else {
        showToast(`Perfil guardado localmente. (${error})`, 'info');
      }
    } else {
      showToast('Perfil actualizado en modo local.', 'info');
    }
  };

  const handleOpenEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  const handleOpenNewSubject = () => {
    setEditingSubject(null);
    setIsSubjectModalOpen(true);
  };

  const handleOpenTopics = (subject: Subject) => {
    setTopicsModalSubject(subject);
  };

  const handleOpenWorkshop = (subject: Subject) => {
    setWorkshopModalSubject(subject);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between relative">
      {/* Toast de notificación de Supabase */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
            syncToast.type === 'success' 
              ? 'bg-slate-900 text-white border-emerald-500/40' 
              : syncToast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-500/40'
              : 'bg-sky-950 text-white border-sky-500/40'
          }`}>
            {syncToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : syncToast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <Database className="w-5 h-5 text-amber-300 shrink-0" />
            )}
            <div className="text-xs font-medium leading-snug">
              {syncToast.message}
            </div>
          </div>
        </div>
      )}

      {/* Barra de Navegación Principal */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNewSubject={handleOpenNewSubject}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={supabaseConnected}
        user={user}
        activeCount={activeSubjects.length}
        overallAverage={summary.overallAverage}
      />

      {/* Contenedor Principal */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Vista: Landing Page */}
        {currentView === 'landing' && (
          <LandingHero
            onGoToDashboard={() => setCurrentView('dashboard')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onGoToSimulator={() => setCurrentView('simulator')}
          />
        )}

        {/* Vista: Panel de Materias (Dashboard) */}
        {currentView === 'dashboard' && (
          <div className="space-y-8 pb-12">
            {/* Barra de estado de sincronización rápida */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  supabaseConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {supabaseConnected ? 'Base de Datos Supabase Conectada' : 'Modo Almacenamiento Local'}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {supabaseConnected 
                      ? 'Las materias creadas, editadas o eliminadas se sincronizan automáticamente en tiempo real.'
                      : 'Puedes conectar Supabase en cualquier momento o usar el almacenamiento local.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="dashboard-sync-btn"
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Sincronizar materias con Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                </button>

                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ver Esquema SQL</span>
                </button>
              </div>
            </div>

            {/* Resumen General de Materias (Requisito 14) */}
            <DashboardSummary
              subjects={subjects}
              onOpenNewSubject={handleOpenNewSubject}
              selectedDifficultyFilter={difficultyFilter}
              onSelectDifficultyFilter={setDifficultyFilter}
            />

            {/* Listado de Materias Activas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-500" />
                    <span>Materias Activas del Semestre</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Calcula la nota requerida, gestiona cortes y genera talleres de refuerzo personalizados
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  Mostrando {filteredActiveSubjects.length} de {activeSubjects.length}
                </span>
              </div>

              {filteredActiveSubjects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      No hay materias registradas con este filtro
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Registra una nueva materia con sus porcentajes de corte y nota objetivo para comenzar a monitorear tus notas con Supabase.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenNewSubject}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-300" />
                    <span>Registrar Primera Materia</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredActiveSubjects.map(subject => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      onEdit={handleOpenEditSubject}
                      onDelete={handleDeleteSubject}
                      onManageTopics={handleOpenTopics}
                      onGenerateWorkshop={handleOpenWorkshop}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista: Simulador de Notas */}
        {currentView === 'simulator' && (
          <SimulatorView
            existingSubjects={subjects}
            onSelectSubjectToLoad={(s) => handleOpenEditSubject(s)}
          />
        )}

        {/* Vista: Historial Académico y Resultados (Requisito 13) */}
        {currentView === 'history' && (
          <HistoryView
            subjects={subjects}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onOpenNewSubject={handleOpenNewSubject}
          />
        )}
      </main>

      {/* Footer Limpio y Elegante (Requisito 18, 19, 21) */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-500 text-amber-300 flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-700">
              Tutorías Académicas Personalizadas
            </span>
            <span className="text-slate-300">•</span>
            <span>Éxito Estudiantil & Rendimiento Académico</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>Integración con Supabase ({supabaseConnected ? 'Conectado' : 'Configurar'})</span>
            </button>
            <span>•</span>
            <span>Paleta Azul Clarito & Amarillo</span>
          </div>
        </div>
      </footer>

      {/* Modal: Registrar o Editar Materia (Requisitos 2, 3, 5, 11, 15, 17) */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        initialSubject={editingSubject}
      />

      {/* Modal: Gestión de Temas y Dificultad (Requisitos 7, 8) */}
      {topicsModalSubject && (
        <TopicsModal
          isOpen={!!topicsModalSubject}
          onClose={() => setTopicsModalSubject(null)}
          subject={topicsModalSubject}
          onSaveTopics={handleUpdateSubjectTopics}
          onGenerateWorkshop={handleOpenWorkshop}
        />
      )}

      {/* Modal: Taller de Refuerzo, Materiales y Exportación PDF (Requisitos 9, 10, 16) */}
      {workshopModalSubject && (
        <WorkshopModal
          isOpen={!!workshopModalSubject}
          onClose={() => setWorkshopModalSubject(null)}
          subject={workshopModalSubject}
          studentName={user.name}
        />
      )}

      {/* Modal: Autenticación y Registro con Supabase (Requisito 1) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onSaveProfile={handleSaveProfile}
        onOpenSupabaseInfo={() => {
          setIsAuthModalOpen(false);
          setIsSupabaseModalOpen(true);
        }}
      />

      {/* Modal: Información y Esquema SQL de Supabase */}
      <SupabaseInfoModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
      />
    </div>
  );
}
