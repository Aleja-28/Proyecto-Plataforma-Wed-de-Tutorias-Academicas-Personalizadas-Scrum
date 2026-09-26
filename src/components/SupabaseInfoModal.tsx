import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';
import { isSupabaseConfigured, getSupabaseClient, SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface SupabaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncNow?: () => void;
  isSyncing?: boolean;
}

export const SupabaseInfoModal: React.FC<SupabaseInfoModalProps> = ({
  isOpen,
  onClose,
  onSyncNow,
  isSyncing = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const configured = isSupabaseConfigured();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Comprobando conexión con Supabase...');

    const client = getSupabaseClient();
    if (!client) {
      setTestStatus('error');
      setTestMessage('Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están configuradas en el entorno.');
      return;
    }

    try {
      // 1. Probar consulta a profiles
      const { error: profileError } = await client.from('profiles').select('id').limit(1);
      if (profileError) {
        if (profileError.code === '42P01' || profileError.message.includes('does not exist')) {
          setTestStatus('error');
          setTestMessage('Conexión con Supabase detectada, pero la tabla "profiles" aún no existe. Copia y ejecuta el script SQL de abajo en el SQL Editor de tu proyecto en Supabase.');
          return;
        } else if (profileError.message.includes('policy') || profileError.code === '42501') {
          setTestStatus('error');
          setTestMessage(`Error de políticas RLS en tabla "profiles": ${profileError.message}. Ejecuta el bloque de políticas SQL de abajo para permitir lectura/escritura.`);
          return;
        }
      }

      // 2. Probar consulta a subjects
      const { error: subjectError } = await client.from('subjects').select('id').limit(1);
      if (subjectError) {
        if (subjectError.code === '42P01' || subjectError.message.includes('does not exist')) {
          setTestStatus('error');
          setTestMessage('Conexión con Supabase detectada, pero la tabla "subjects" no existe aún. Ejecuta el script SQL en el SQL Editor de tu proyecto en Supabase.');
          return;
        }
      }

      setTestStatus('success');
      setTestMessage('¡Conexión y tablas de Supabase verificadas exitosamente! Todo listo para guardar registros y materias.');
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err?.message || 'No se pudo contactar el servidor de Supabase.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="supabase-info-modal-card"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 p-5 sm:p-6 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md text-white">
                Base de Datos Cloud
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Integración con Supabase
              </h2>
              <p className="text-xs text-emerald-100">
                Persistencia en tiempo real para registro de estudiantes y materias
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5 sm:p-6 overflow-y-auto grow space-y-5">
          {/* Estado de conexión */}
          <div className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
            configured ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Estado: {configured ? 'Variables de Supabase Detectadas' : 'Modo Local / Esperando Credenciales'}
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                {configured 
                  ? `Conectado a la URL: ${supabaseUrl || 'Configurada en .env'}`
                  : 'Para sincronizar en la nube con Supabase, declara VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tus variables de entorno.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>Probar Conexión</span>
              </button>

              {onSyncNow && (
                <button
                  onClick={onSyncNow}
                  disabled={isSyncing}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Server className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Resultado de la prueba */}
          {testMessage && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              testStatus === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : testStatus === 'error'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              {testStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span>{testMessage}</span>
              </div>
            </div>
          )}

          {/* Instrucciones de Configuración y Schema SQL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Esquema SQL de Tablas para Supabase
                </h4>
                <p className="text-[11px] text-slate-500">
                  Crea las tablas <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700 font-mono">profiles</code> y <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700 font-mono">subjects</code> en tu SQL Editor:
                </p>
              </div>

              <button
                onClick={handleCopySQL}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Script SQL'}</span>
              </button>
            </div>

            <div className="relative bg-slate-900 rounded-2xl p-4 overflow-x-auto text-[11px] font-mono text-emerald-300 max-h-56 leading-relaxed">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>

          {/* Características activas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Registro de Usuario
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                Sincronización en tabla <code className="text-sky-700">profiles</code> y Supabase Auth
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Materias (CRUD)
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                Creación, edición y eliminación instantánea en <code className="text-sky-700">subjects</code>
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Modo Híbrido Resiliente
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                Copia de respaldo local automática para que nunca pierdas datos
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
