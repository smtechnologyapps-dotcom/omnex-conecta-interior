'use client';

import React from 'react';
import { useServiceWorkerUpdate } from '@/hooks/useServiceWorkerUpdate';
import { Sparkles, ShieldCheck, RefreshCw, X } from 'lucide-react';

export function UpdateBanner() {
  const { updateAvailable, applyUpdate, dismiss, versionName } = useServiceWorkerUpdate();

  if (!updateAvailable) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      data-testid="pwa-update-banner"
      className="fixed bottom-6 left-1/2 z-50 w-[94%] max-w-lg -translate-x-1/2 rounded-2xl border border-[#2DD4BF]/40 bg-[#0A1626]/95 p-4 sm:p-5 shadow-[0_0_35px_rgba(45,212,191,0.25)] backdrop-blur-xl text-white transition-all animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF] shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                Nueva versión disponible
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#2DD4BF] font-semibold">
                {versionName}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span>Tus censos y datos en cola local están blindados. Cero pérdida de registros.</span>
            </p>
          </div>
        </div>

        <button
          onClick={dismiss}
          data-testid="pwa-update-dismiss-btn"
          aria-label="Cerrar notificación"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <button
          onClick={applyUpdate}
          data-testid="pwa-update-confirm-btn"
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#2DD4BF] hover:bg-[#20bca7] text-[#050B14] font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(45,212,191,0.4)] flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar Ahora</span>
        </button>

        <button
          onClick={dismiss}
          className="py-2.5 px-4 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs sm:text-sm transition-colors"
        >
          Posponer
        </button>
      </div>
    </div>
  );
}
