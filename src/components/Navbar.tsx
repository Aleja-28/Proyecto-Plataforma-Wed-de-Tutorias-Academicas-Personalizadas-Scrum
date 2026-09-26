import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  History, 
  Calculator, 
  PlusCircle, 
  User, 
  Menu, 
  X,
  Compass,
  Database
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'history' | 'simulator';
  onViewChange: (view: 'landing' | 'dashboard' | 'history' | 'simulator') => void;
  onOpenAuth: () => void;
  onOpenNewSubject: () => void;
  onOpenSupabaseModal?: () => void;
  isSupabaseConnected?: boolean;
  user: UserProfile;
  activeCount: number;
  overallAverage: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenAuth,
  onOpenNewSubject,
  onOpenSupabaseModal,
  isSupabaseConnected = false,
  user,
  activeCount,
  overallAverage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Marca */}
          <div 
            id="brand-logo-container"
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800">
                  Tutorías<span className="text-sky-500">Pro</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-md border border-amber-200/80">
                  Académico
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Tutorías & Cálculo de Calificaciones
              </p>
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-50/80 p-1 rounded-xl border border-slate-200/60">
            <button
              id="nav-landing-btn"
              onClick={() => onViewChange('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'landing'
                  ? 'bg-white text-sky-600 shadow-xs border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Conoce la Plataforma</span>
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-white text-sky-600 shadow-xs border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mis Materias</span>
              <span className="ml-1 px-1.5 py-0.2 bg-sky-100 text-sky-700 rounded-full text-[10px] font-bold">
                {activeCount}
              </span>
            </button>

            <button
              id="nav-simulator-btn"
              onClick={() => onViewChange('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'simulator'
                  ? 'bg-white text-sky-600 shadow-xs border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador de Nota</span>
            </button>

            <button
              id="nav-history-btn"
              onClick={() => onViewChange('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'history'
                  ? 'bg-white text-sky-600 shadow-xs border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historial & Resultados</span>
            </button>
          </nav>

          {/* Acciones del Usuario & CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Supabase Status Button */}
            {onOpenSupabaseModal && (
              <button
                id="nav-supabase-badge-btn"
                onClick={onOpenSupabaseModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                  isSupabaseConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="Configuración y estado de la base de datos Supabase"
              >
                <Database className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden xl:inline">Supabase:</span>
                <span className="flex items-center gap-1 font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  {isSupabaseConnected ? 'Conectado' : 'Configurar'}
                </span>
              </button>
            )}

            {/* Promedio Global Rápido */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/70 rounded-lg">
              <span className="text-[11px] font-medium text-amber-900">Promedio:</span>
              <span className="text-xs font-extrabold text-amber-700">
                {overallAverage > 0 ? overallAverage.toFixed(2) : '0.0'}
              </span>
            </div>

            {/* Botón Nueva Materia */}
            <button
              id="nav-new-subject-btn"
              onClick={onOpenNewSubject}
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Nueva Materia</span>
            </button>

            {/* Perfil / Login Modal */}
            <button
              id="nav-user-profile-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/70 text-slate-700"
              title="Ver o cambiar perfil de usuario"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs border border-sky-200">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold leading-tight truncate max-w-[110px]">
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-500 leading-none">
                  {user.isDemo ? 'Cuenta Demo' : 'Estudiante'}
                </p>
              </div>
            </button>
          </div>

          {/* Botón Móvil */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <button
            onClick={() => { onViewChange('landing'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'landing' ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-500" />
            <span>Conoce la Plataforma</span>
          </button>

          <button
            onClick={() => { onViewChange('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'dashboard' ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>Mis Materias</span>
            </div>
            <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded-full font-bold">
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => { onViewChange('simulator'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'simulator' ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <Calculator className="w-4 h-4 text-sky-500" />
            <span>Simulador de Nota</span>
          </button>

          <button
            onClick={() => { onViewChange('history'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'history' ? 'bg-sky-50 text-sky-600 font-semibold' : 'text-slate-600'
            }`}
          >
            <History className="w-4 h-4 text-sky-500" />
            <span>Historial & Resultados</span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {onOpenSupabaseModal && (
              <button
                onClick={() => { onOpenSupabaseModal(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold"
              >
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Base de Datos Supabase ({isSupabaseConnected ? 'Conectado' : 'Configurar'})</span>
              </button>
            )}

            <button
              onClick={() => { onOpenNewSubject(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-semibold shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Registrar Nueva Materia</span>
            </button>

            <button
              onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Perfil: {user.name} ({user.isDemo ? 'Demo' : 'Activo'})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
