'use client';

import React from 'react';
import { 
  Truck, 
  MapPin, 
  QrCode, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Users, 
  Droplets, 
  ExternalLink,
  Sparkles,
  Compass
} from 'lucide-react';
import { ActiveView } from '@/types';

interface PortalVoluntariosViewProps {
  onNavigate: (view: ActiveView) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const PortalVoluntariosView: React.FC<PortalVoluntariosViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const missions = [
    {
      id: 'MIS-AZ-01',
      familyCode: 'FAM-PTI-042',
      location: 'Oria Arriba, Pedasí',
      urgency: 'ALTO (<72h)',
      urgencyBadgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]',
      composition: '4 Habitantes (1 Niño, 1 Adulto Mayor)',
      needs: 'Agua Potable 20L + Módulo Familiar',
      distance: '1.2 km de tu posición',
      wazeUrl: 'https://waze.com/ul?ll=7.5342,-80.0211&navigate=yes',
    },
    {
      id: 'MIS-AZ-02',
      familyCode: 'FAM-TON-018',
      location: 'El Cacao, Tonosí',
      urgency: 'CRÍTICO (<24h)',
      urgencyBadgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      composition: '6 Habitantes (2 Niños, Discapacidad)',
      needs: 'Agua Potable + Medicamentos + Lámpara',
      distance: '8.4 km (Vado anegado, 4x4)',
      wazeUrl: 'https://waze.com/ul?ll=7.4166,-80.4500&navigate=yes',
    },
    {
      id: 'MIS-AZ-03',
      familyCode: 'FAM-MAC-009',
      location: 'El Cedro, Macaracas',
      urgency: 'MODERADO (7 Días)',
      urgencyBadgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      composition: '3 Habitantes (Adultos)',
      needs: 'Kits de Higiene + Alimentos',
      distance: '14.1 km',
      wazeUrl: 'https://waze.com/ul?ll=7.7167,-80.5333&navigate=yes',
    },
  ];

  const handleAcceptMission = (id: string) => {
    onShowToast(`Misión ${id} confirmada. Iniciando ruta con geocercado activo.`, 'check');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Hero Banner with Soft Organic Glassmorphic Finish */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a2e]/95 via-[#081322]/90 to-[#040812]/95 border border-teal-500/20 p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl mb-6">
        {/* Soft Ambient Radial Glow Accent */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Operaciones OMNEX · Brigada Azuero
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-0.5 rounded-full border border-slate-800">
                <Compass className="w-3 h-3 text-teal-400" />
                <span>Geocercas 4x4</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight font-sans">
              Portal de Voluntarios de Entrega
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Misiones de socorro humanitario en tu cuadrante rural con navegación en tiempo real vía Waze y validación criptográfica de un solo uso con quema atómica de tokens.
            </p>
          </div>

          <button
            onClick={() => onNavigate('despacho-qr')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto shrink-0"
          >
            <QrCode className="w-4 h-4 text-slate-950" />
            <span>Abrir Escáner QR de Entrega</span>
          </button>
        </div>
      </div>

      {/* Mission Cards with Smooth Organic Curves & Soft Neon Ambience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {missions.map((m) => (
          <div 
            key={m.id} 
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0e1d33]/90 via-[#0a1626]/85 to-[#060c18]/95 border border-teal-500/15 hover:border-teal-500/40 p-6 shadow-[0_10px_35px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_15px_45px_rgba(45,212,191,0.15)] hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Subtle Card Glow on Hover */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-teal-500/5 blur-2xl group-hover:bg-teal-500/10 transition-all pointer-events-none"></div>

            <div className="relative z-10">
              {/* Mission Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
                <span className="font-mono text-sm font-extrabold text-white tracking-wide">{m.id}</span>
                <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${m.urgencyBadgeClass}`}>
                  {m.urgency}
                </span>
              </div>

              {/* Family Destination Block */}
              <div className="mb-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-sm">
                <span className="text-[10px] text-teal-400 font-mono font-bold uppercase tracking-wider block mb-0.5">
                  Núcleo Familiar:
                </span>
                <h3 className="text-base font-extrabold text-white font-mono tracking-tight">{m.familyCode}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-medium">{m.location}</span>
                </div>
              </div>

              {/* Operational Specs Capsule */}
              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/60 mb-5 shadow-inner">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{m.composition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{m.needs}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-teal-300 font-bold pt-1 border-t border-slate-900">
                  <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{m.distance}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons with Rounded Curves */}
            <div className="relative z-10 space-y-2.5 pt-3 border-t border-slate-800/80">
              <a
                href={m.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700/60 shadow-sm hover:border-teal-500/40 hover:scale-[1.01]"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Navegar con Waze</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
              </a>

              <button
                type="button"
                onClick={() => handleAcceptMission(m.id)}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-teal-400/15 to-emerald-500/15 hover:from-teal-500/30 hover:to-emerald-500/30 text-teal-300 text-xs font-black transition-all flex items-center justify-center gap-2 border border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.12)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Aceptar y Validar QR</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
