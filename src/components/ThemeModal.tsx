import React, { useState } from 'react';
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { ThemeColorId } from '../types';
import { THEME_CONFIGS, ThemeConfig } from '../utils/themeConfig';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeColorId;
  onSelectTheme: (themeId: ThemeColorId) => void;
  studentName: string;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  studentName,
}) => {
  const [activeTheme, setActiveTheme] = useState<ThemeColorId>(currentTheme);
  const [customColor, setCustomColor] = useState('#0284c7');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleApplyTheme = (themeId: ThemeColorId) => {
    setActiveTheme(themeId);
    setIsCustomMode(false);
    onSelectTheme(themeId);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleApplyCustomColor = (hex: string) => {
    setCustomColor(hex);
    setIsCustomMode(true);
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', hex);
    root.style.setProperty('--theme-accent', '#f59e0b');
    root.style.setProperty('--theme-badge', hex);
    try {
      localStorage.setItem('tutorias_custom_color', hex);
    } catch (e) {
      console.warn('Error saving custom color', e);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    handleApplyTheme('sky');
    const root = document.documentElement;
    root.style.removeProperty('--theme-primary');
    root.style.removeProperty('--theme-accent');
    root.style.removeProperty('--theme-badge');
    try {
      localStorage.removeItem('tutorias_custom_color');
    } catch (e) {
      console.warn(e);
    }
  };

  const themeList = Object.values(THEME_CONFIGS);
  const currentConfig = THEME_CONFIGS[activeTheme] || THEME_CONFIGS.sky;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300"
              style={{ backgroundColor: isCustomMode ? customColor : currentConfig.primaryHex }}
            >
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="theme-modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
                Personalizar Color y Tema de la Plataforma
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hola {studentName.split(' ')[0]}, elige la paleta visual que mejor se adapte a tu estilo de estudio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Tema aplicado y guardado en tu navegador exitosamente!</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Persistente</span>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Paletas Académicas Diseñadas (7 Estilos)</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Tema activo: <strong className="text-slate-700">{isCustomMode ? 'Color Personalizado' : currentConfig.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {themeList.map((theme: ThemeConfig) => {
              const isSelected = !isCustomMode && activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleApplyTheme(theme.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all group ${
                    isSelected
                      ? 'border-2 shadow-sm bg-slate-50/80'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.primaryHex : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-xl shadow-xs flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ backgroundColor: theme.primaryHex }}
                    >
                      <div 
                        className="absolute bottom-0 right-0 w-4 h-4 rounded-tl-md shadow-xs" 
                        style={{ backgroundColor: theme.accentHex }}
                      />
                      {isSelected && <Check className="w-4 h-4 text-white relative z-10 drop-shadow" />}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-800">
                        {theme.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {theme.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full" 
                      style={{ backgroundColor: theme.primaryHex }}
                      title="Color Primario" 
                    />
                    <span 
                      className="w-3.5 h-3.5 rounded-full" 
                      style={{ backgroundColor: theme.accentHex }}
                      title="Color Acento" 
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-500" />
              <span>¿Quieres un color específico para tu universidad?</span>
            </label>
            {isCustomMode && (
              <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                Modo Libre Activo
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleApplyCustomColor(e.target.value)}
                className="w-9 h-9 rounded-xl border-0 cursor-pointer bg-transparent p-0"
                title="Selecciona cualquier color"
              />
              <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                {customColor}
              </span>
            </div>

            <div className="flex items-center gap-1.5 grow">
              {[
                { hex: '#0284c7', label: 'Cielo' },
                { hex: '#2563eb', label: 'Cobalto' },
                { hex: '#059669', label: 'Verde' },
                { hex: '#7c3aed', label: 'Morado' },
                { hex: '#ea580c', label: 'Naranja' },
                { hex: '#dc2626', label: 'Rojo' },
                { hex: '#0f766e', label: 'Petróleo' },
                { hex: '#1e293b', label: 'Grafito' }
              ].map(swatch => (
                <button
                  key={swatch.hex}
                  onClick={() => handleApplyCustomColor(swatch.hex)}
                  className="w-6 h-6 rounded-full border border-white shadow-xs transition-transform hover:scale-110"
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.label}
                />
              ))}
            </div>

            <button
              onClick={() => handleApplyCustomColor(customColor)}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Aplicar Color
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Vista Previa de Componentes
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all"
              style={{ backgroundColor: isCustomMode ? customColor : currentConfig.primaryHex }}
            >
              Botón Principal
            </button>
            <span 
              className="px-3 py-1 rounded-lg text-xs font-bold border"
              style={{ 
                backgroundColor: isCustomMode ? `${customColor}15` : undefined, 
                color: isCustomMode ? customColor : undefined,
                borderColor: isCustomMode ? `${customColor}40` : undefined,
              }}
            >
              Insignia de Avance
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Así lucirán los elementos interactivos en tu panel
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer predeterminado</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-95"
            style={{ backgroundColor: isCustomMode ? customColor : currentConfig.primaryHex }}
          >
            Listo, Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
