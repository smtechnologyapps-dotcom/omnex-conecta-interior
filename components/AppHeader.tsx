'use client';

import React from 'react';
import { 
  ShieldAlert, 
  HeartPulse, 
  Flame, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

interface AppHeaderProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onForcedSync: () => void;
  isSyncing: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onForcedSync,
  isSyncing,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131b2e] text-white shadow-md border-b border-slate-800">
      <div className="h-20 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#006591] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <span className="tracking-tighter">OM</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white leading-none">
                  OMNEX Conecta
                </span>
                <span className="text-[10px] font-semibold bg-teal-950 text-teal-400 border border-teal-700/60 px-1.5 py-0.5 rounded tracking-wide">
                  TACTICAL PWA
                </span>
              </div>
              <span className="text-xs text-[#89ceff] font-medium tracking-wide mt-1">
                Interior v2.0 · Sistema Humanitario
              </span>
            </div>
          </div>

          {/* Marcación Rápida Panamá */}
          <div className="hidden xl:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Marcación Rápida:
            </span>
            <div className="flex items-center gap-2">
              <a
                href="tel:103"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                title="Emergencias SINAPROC Panamá"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SINAPROC 103</span>
              </a>
              <a
                href="tel:118"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                title="Cruz Roja Panameña"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Cruz Roja 118</span>
              </a>
              <a
                href="tel:104"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                title="Cuerpo de Bomberos de Panamá"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Bomberos 104</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          {/* Online/Offline Toggle Button */}
          <button
            onClick={onToggleOnline}
            data-testid="online-toggle-btn"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              isOnline
                ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-400'
                : 'bg-amber-950/70 border-amber-700/60 text-amber-300'
            }`}
            title="Conmutar simulación de conectividad de red celular / Starlink"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">En Línea (Starlink)</span>
                <span className="sm:hidden">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sin Conexión (Offline PWA)</span>
                <span className="sm:hidden">Offline</span>
              </>
            )}
          </button>

          {/* Sync Queue */}
          <button
            onClick={onForcedSync}
            disabled={isSyncing}
            data-testid="sync-trigger-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-[#c9e6ff] hover:bg-white/10 transition-colors"
            title="Presione para forzar sincronización de registros con Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#39b8fd] ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Cola Sync:</span>
            <span data-testid="pending-sync-badge" className="font-mono font-bold text-white">{pendingSyncCount}</span>
            <span className="hidden md:inline text-slate-400">Pendientes</span>
          </button>

          {/* IndexedDB Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono uppercase text-[11px]">IndexedDB Activo</span>
          </div>

          {/* Ley 81 Compliance Tag */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#dae2fd]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#39b8fd]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Ley 81 OK</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-sm text-white">
              AH
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">Ana Herrera</span>
              <span className="text-[11px] text-slate-400 leading-tight">Coordinadora Campo · Azuero</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
