import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Building2, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles,
  Database,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { isSupabaseConfigured, getSupabaseClient, saveProfileInSupabase, fetchProfileFromSupabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenSupabaseInfo?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
  onOpenSupabaseInfo,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('register');
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [career, setCareer] = useState(currentUser.career || '');
  const [semester, setSemester] = useState(currentUser.semester || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const supabaseConfigured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validaciones básicas
    if (tab === 'register' && !name.trim()) {
      setErrorMessage('Por favor ingresa el nombre completo del estudiante.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      if (tab === 'register') {
        let userId = currentUser.id || `user-${Date.now()}`;
        let requiresEmailConfirmation = false;

        // 1. Si Supabase está configurado, registrar usuario en Supabase Auth
        if (supabaseConfigured && supabase) {
          try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
              email: email.trim(),
              password: password,
              options: {
                data: {
                  name: name.trim(),
                  institution: institution.trim(),
                  career: career.trim(),
                  semester: semester.trim(),
                }
              }
            });

            if (authError) {
              if (authError.message.toLowerCase().includes('already registered')) {
                setErrorMessage('Este correo ya está registrado en Supabase. Si ya tienes cuenta, cambia a la pestaña "Iniciar Sesión" arriba.');
              } else {
                setErrorMessage(`Error de Supabase Auth: ${authError.message}`);
              }
              setIsLoading(false);
              return;
            }

            if (authData?.user?.id) {
              userId = authData.user.id;
              // Si la sesión es nula, Supabase tiene activa la confirmación por email
              if (!authData.session) {
                requiresEmailConfirmation = true;
              }
            }
          } catch (authErr: any) {
            setErrorMessage(`Error al contactar Supabase Auth: ${authErr?.message || 'Error de conexión'}`);
            setIsLoading(false);
            return;
          }
        }

        const updatedUser: UserProfile = {
          id: userId,
          name: name.trim() || 'Estudiante',
          email: email.trim(),
          institution: institution.trim() || 'Universidad',
          career: career.trim() || 'Carrera Profesional',
          semester: semester.trim() || 'Periodo Actual',
          avatarSeed: currentUser.avatarSeed || `seed-${Date.now()}`,
          isDemo: false,
        };

        // 2. Guardar en la tabla profiles de Supabase si está configurado
        if (supabaseConfigured) {
          const { success: profileSaved, error: profileError } = await saveProfileInSupabase(updatedUser);
          if (!profileSaved && profileError) {
            setErrorMessage(
              `Error al guardar en la tabla 'profiles' de Supabase: ${profileError}. Verifica haber ejecutado el script SQL en el SQL Editor de tu proyecto en Supabase.`
            );
            setIsLoading(false);
            return;
          }
        }

        // 3. Actualizar estado local
        onSaveProfile(updatedUser);

        if (supabaseConfigured) {
          if (requiresEmailConfirmation) {
            setSuccessMessage(
              '¡Usuario registrado en Supabase! ⚠️ Supabase envió un email de confirmación a tu correo. Confírmalo antes de iniciar sesión (o desactiva "Confirm email" en Supabase > Auth > Providers > Email).'
            );
          } else {
            setSuccessMessage('¡Perfil registrado y guardado exitosamente en Supabase!');
          }
        } else {
          setSuccessMessage(
            '¡Perfil guardado localmente! (Supabase no detectado en este entorno. Al desplegar en Vercel, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Environment Variables).'
          );
        }

        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, requiresEmailConfirmation ? 3500 : 1500);

      } else {
        // Pestaña Iniciar Sesión (Login)
        let loggedProfile: UserProfile = {
          ...currentUser,
          email: email.trim(),
          isDemo: false,
        };

        if (supabaseConfigured && supabase) {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });

          if (authError) {
            if (authError.message.toLowerCase().includes('email not confirmed')) {
              setErrorMessage('Tu correo no ha sido confirmado aún en Supabase. Revisa tu bandeja de entrada o desactiva "Confirm email" en tu panel de Supabase.');
            } else if (authError.message.toLowerCase().includes('invalid login credentials')) {
              setErrorMessage('Credenciales incorrectas: Correo o contraseña erróneos en Supabase.');
            } else {
              setErrorMessage(`Error de autenticación en Supabase: ${authError.message}`);
            }
            setIsLoading(false);
            return;
          }

          if (authData?.user) {
            const userMeta = authData.user.user_metadata || {};
            // Recuperar el perfil de la tabla profiles
            const { data: cloudProfile } = await fetchProfileFromSupabase(authData.user.id);

            loggedProfile = {
              id: authData.user.id,
              name: cloudProfile?.name || userMeta.name || name.trim() || currentUser.name,
              email: authData.user.email || email.trim(),
              institution: cloudProfile?.institution || userMeta.institution || currentUser.institution,
              career: cloudProfile?.career || userMeta.career || currentUser.career,
              semester: cloudProfile?.semester || userMeta.semester || currentUser.semester,
              avatarSeed: cloudProfile?.avatarSeed || currentUser.avatarSeed,
              isDemo: false,
            };
          }
        } else {
          // Modo local
          loggedProfile.name = name.trim() || currentUser.name;
        }

        onSaveProfile(loggedProfile);
        setSuccessMessage('¡Sesión iniciada correctamente!');

        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ocurrió un problema inesperado al procesar el formulario.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
      >
        {/* Cabecera estilizada con azul clarito y amarillo */}
        <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 p-6 text-white relative">
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {tab === 'register' ? 'Registro de Estudiante' : 'Bienvenido de Nuevo'}
                </h2>
              </div>
              <p className="text-xs text-sky-100 mt-0.5">
                Plataforma Web de Tutorías Académicas Personalizadas
              </p>
            </div>
          </div>

          {/* Selector de pestañas */}
          <div className="flex bg-sky-600/50 p-1 rounded-xl mt-5">
            <button
              id="tab-register-btn"
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Crear Cuenta Estudiantil
            </button>
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Notificación de aviso sobre Supabase */}
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-2.5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-sky-900">
            <Database className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              {supabaseConfigured ? (
                <>
                  <strong className="text-emerald-700">Supabase Activo:</strong> Tu perfil y materias se sincronizan en la nube.
                </>
              ) : (
                <>
                  <strong className="text-amber-800">Supabase Configurable:</strong> Guarda localmente y sincroniza con tu base de datos Supabase.
                </>
              )}
            </span>
          </div>

          {onOpenSupabaseInfo && (
            <button
              type="button"
              onClick={onOpenSupabaseInfo}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 underline shrink-0"
            >
              Ver esquema SQL
            </button>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre Completo del Estudiante
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Camila Rodriguez"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo Electrónico Institucional o Personal
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="estudiante@universidad.edu.co"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="auth-password-input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Institución / Universidad
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="auth-institution-input"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Universidad"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Carrera / Grado
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="auth-career-input"
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="Ej: Ing. de Sistemas"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Semestre o Periodo Académico
                </label>
                <input
                  id="auth-semester-input"
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="Ej: 4to Semestre (2026-1)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-400 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2 p-3.5 bg-rose-50 text-rose-900 border border-rose-200 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-sky-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Procesando con Supabase...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{tab === 'register' ? 'Crear Perfil en Supabase' : 'Entrar a la Plataforma'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
