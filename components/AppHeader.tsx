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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060D18]/90 backdrop-blur-2xl border-b border-teal-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      <div className="h-20 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-700 flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_20px_rgba(45,212,191,0.35)]">
              <span className="tracking-tighter font-mono">OM</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white leading-none font-sans">
                  OMNEX Conecta
                </span>
                <span className="text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-full tracking-wider font-mono">
                  TACTICAL PWA
                </span>
              </div>
              <span className="text-xs text-[#89ceff] font-medium tracking-wide mt-1">
                Interior v2.0 · Sistema Humanitario
              </span>
            </div>
          </div>

          {/* Marcación Rápida Panamá (Organics Capsule) */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-900/70 border border-slate-700/60 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-inner">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1 font-mono">
              SOS Rápido:
            </span>
            <div className="flex items-center gap-1.5">
              <a
                href="tel:103"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-[0_2px_10px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95"
                title="Emergencias SINAPROC Panamá"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SINAPROC 103</span>
              </a>
              <a
                href="tel:118"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition-all shadow-[0_2px_10px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95"
                title="Cruz Roja Panameña"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Cruz Roja 118</span>
              </a>
              <a
                href="tel:104"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-[0_2px_10px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95"
                title="Cuerpo de Bomberos de Panamá"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Bomberos 104</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Online/Offline Toggle Button */}
          <button
            onClick={onToggleOnline}
            data-testid="online-toggle-btn"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all shadow-sm ${
              isOnline
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-amber-500/15 border-amber-500/35 text-amber-300 hover:bg-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
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
                <span className="hidden sm:inline">Sin Conexión (Offline)</span>
                <span className="sm:hidden">Offline</span>
              </>
            )}
          </button>

          {/* Sync Queue Capsule */}
          <button
            onClick={onForcedSync}
            disabled={isSyncing}
            data-testid="sync-trigger-btn"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-xs font-medium text-slate-200 hover:border-teal-500/40 hover:bg-slate-800/80 transition-all shadow-sm"
            title="Presione para forzar sincronización de registros con Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Cola Sync:</span>
            <span data-testid="pending-sync-badge" className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 text-[11px]">{pendingSyncCount}</span>
            <span className="hidden md:inline text-slate-400 text-[11px]">Pendientes</span>
          </button>

          {/* IndexedDB Capsule */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono uppercase text-[10px] tracking-wider text-slate-300 font-bold">IndexedDB</span>
          </div>

          {/* Ley 81 Compliance Tag */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-teal-500/25 text-xs text-teal-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold uppercase tracking-wider text-[10px] font-mono">Ley 81 OK</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border-2 border-teal-500/30 flex items-center justify-center font-bold text-xs text-teal-300 shadow-md">
              AH
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">Ana Herrera</span>
              <span className="text-[10px] text-teal-400/90 leading-tight font-mono">Coordinadora Campo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
