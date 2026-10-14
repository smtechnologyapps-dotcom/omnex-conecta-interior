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
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 bg-[#0A1626]/95 border-r border-slate-800/80 z-40 flex flex-col justify-between py-4 overflow-y-auto backdrop-blur-xl">
      <div className="flex flex-col gap-6 px-3">
        {/* Section 1: Operaciones de Campo */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-mono">
            Operaciones Tácticas
          </span>
          <nav className="flex flex-col gap-1">
            {operationalItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  data-testid={`sidebar-nav-${item.id}`}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.2)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#2DD4BF] text-[#050B14]'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
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
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-mono">
            Comunidad & Mando
          </span>
          <nav className="flex flex-col gap-1">
            {communityItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  data-testid={`sidebar-nav-${item.id}`}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_15px_rgba(45,212,191,0.2)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2DD4BF]' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Antigravity Spec */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2 font-mono">
            Arquitectura de Software
          </span>
          <nav className="flex flex-col gap-1">
            {specItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  data-testid={`sidebar-nav-${item.id}`}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#60A5FA]/15 text-[#60A5FA] border border-[#60A5FA]/30 shadow-[0_0_15px_rgba(96,165,250,0.2)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#60A5FA]' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/40">
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
        <div className="p-3 rounded-xl bg-[#050B14]/90 border border-[#2DD4BF]/20 text-xs text-slate-400 flex flex-col gap-1 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
              <span>Cifrado FIPS 140-3</span>
            </div>
            <span className="text-[9px] font-mono bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.2 rounded font-bold">
              ACTIVO
            </span>
          </div>
          <span className="text-[10px] leading-relaxed text-slate-400 mt-1">
            Bóveda IndexedDB protegida con WebCrypto AES-GCM-256 + PBKDF2 (600k iteraciones).
          </span>
        </div>
        <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#2DD4BF]" />
            <span>NODO #PAN-AZ-04</span>
          </span>
          <span className="text-slate-400">v2.4.2 TÁCTICO</span>
        </div>
      </div>
    </aside>
  );
};
