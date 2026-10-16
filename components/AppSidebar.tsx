'use client';

import React from 'react';
import { 
  Network, 
  UserCheck, 
  QrCode, 
  Scale, 
  Users, 
  Truck, 
  Radio, 
  SlidersHorizontal, 
  FileCode2, 
  ShieldCheck,
  Cpu,
  Database
} from 'lucide-react';
import { ActiveView } from '@/types';

interface AppSidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  pendingSyncCount: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeView,
  onSelectView,
  pendingSyncCount,
}) => {
  const operationalItems = [
    {
      id: 'centro-mando' as ActiveView,
      label: 'Centro de Mando & COE',
      icon: Network,
      badge: null,
    },
    {
      id: 'censo-offline' as ActiveView,
      label: 'Censo Territorial Offline',
      icon: UserCheck,
      badge: pendingSyncCount > 0 ? `${pendingSyncCount}` : null,
    },
    {
      id: 'despacho-qr' as ActiveView,
      label: 'Despacho & Validación QR',
      icon: QrCode,
      badge: 'ATOMIC',
    },
    {
      id: 'auditoria-ley81' as ActiveView,
      label: 'Auditoría & Cumplimiento Ley 81',
      icon: Scale,
      badge: 'VERIFICADO',
    },
  ];

  const communityItems = [
    {
      id: 'portal-pacientes' as ActiveView,
      label: 'Portal Beneficiarios & ARCO',
      icon: Users,
      badge: null,
    },
    {
      id: 'portal-voluntarios' as ActiveView,
      label: 'Brigadas de Terreno',
      icon: Truck,
      badge: null,
    },
    {
      id: 'muro-comunicaciones' as ActiveView,
      label: 'Comunicaciones & Albergues',
      icon: Radio,
      badge: 'OFICIAL',
    },
    {
      id: 'panel-administracion' as ActiveView,
      label: 'Dirección & Webhooks n8n',
      icon: SlidersHorizontal,
      badge: null,
    },
  ];

  const specItems = [
    {
      id: 'antigravity-spec' as ActiveView,
      label: 'Visor Arquitectura & JSON',
      icon: FileCode2,
      badge: 'PWA v2.4',
    },
  ];

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 bg-[#060D1A]/95 border-r border-teal-500/10 z-40 flex flex-col justify-between py-4 overflow-y-auto backdrop-blur-2xl">
      <div className="flex flex-col gap-6 px-3">
        {/* Section 1: Operaciones de Campo */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-mono">
            Operaciones Tácticas
          </span>
          <nav className="flex flex-col gap-1.5">
            {operationalItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  data-testid={`sidebar-nav-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 via-teal-400/15 to-transparent text-teal-300 border border-teal-500/35 shadow-[0_0_20px_rgba(45,212,191,0.18)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-teal-400 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Portales Operativos */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-mono">
            Comunidad & Mando
          </span>
          <nav className="flex flex-col gap-1.5">
            {communityItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  data-testid={`sidebar-nav-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 via-teal-400/15 to-transparent text-teal-300 border border-teal-500/35 shadow-[0_0_20px_rgba(45,212,191,0.18)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-teal-400 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Especificación */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-mono">
            Arquitectura de Software
          </span>
          <nav className="flex flex-col gap-1.5">
            {specItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  data-testid={`sidebar-nav-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/20 via-sky-400/15 to-transparent text-sky-300 border border-sky-500/35 shadow-[0_0_20px_rgba(56,189,248,0.18)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Terminal Node Security Callout */}
      <div className="px-3 pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0a1626] to-[#040810] border border-teal-500/20 text-xs text-slate-400 flex flex-col gap-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Cifrado FIPS 140-3</span>
            </div>
            <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              ACTIVO
            </span>
          </div>
          <span className="text-[10px] leading-relaxed text-slate-400 mt-0.5">
            Bóveda IndexedDB protegida con WebCrypto AES-GCM-256 + PBKDF2 (600k iteraciones).
          </span>
        </div>
        <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-teal-400" />
            <span>NODO #PAN-AZ-04</span>
          </span>
          <span className="text-slate-400 font-bold">v2.4.2 TÁCTICO</span>
        </div>
      </div>
    </aside>
  );
};
