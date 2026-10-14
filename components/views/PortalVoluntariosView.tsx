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
  ExternalLink 
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
      urgencyColor: 'bg-sky-100 text-[#006591] border-sky-300',
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
      urgencyColor: 'bg-red-100 text-red-800 border-red-300',
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
      urgencyColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold bg-sky-100 text-[#006591] px-2 py-0.5 rounded uppercase">
            Operaciones OMNEX · Brigada Azuero
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Portal de Voluntarios de Entrega
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Misiones de socorro asignadas en tu cuadrante rural con navegación Waze y validación de QR JWT.
          </p>
        </div>

        <button
          onClick={() => onNavigate('despacho-qr')}
          className="px-4 py-2 rounded-lg bg-[#006591] hover:bg-[#004e70] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs self-start md:self-auto"
        >
          <QrCode className="w-4 h-4 text-sky-300" />
          <span>Abrir Escáner QR de Entrega</span>
        </button>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {missions.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-900">{m.id}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${m.urgencyColor}`}>
                  {m.urgency}
                </span>
              </div>

              <div className="mb-3">
                <span className="text-xs text-slate-400 font-semibold block">Familia:</span>
                <h3 className="text-sm font-bold text-slate-900 font-mono">{m.familyCode}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#006591]" />
                  <span>{m.location}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{m.composition}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{m.needs}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#006591] font-bold">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{m.distance}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <a
                href={m.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Navigation className="w-3.5 h-3.5 text-[#006591]" />
                <span>Navegar con Waze</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <button
                type="button"
                onClick={() => handleAcceptMission(m.id)}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Aceptar y Validar QR</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
