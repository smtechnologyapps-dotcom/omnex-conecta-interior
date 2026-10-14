'use client';

import React from 'react';
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  Home, 
  Droplets, 
  Clock, 
  PhoneCall, 
  CheckCircle2 
} from 'lucide-react';

interface MuroComunicacionesViewProps {
  onShowToast: (message: string, icon?: string) => void;
}

export const MuroComunicacionesView: React.FC<MuroComunicacionesViewProps> = ({
  onShowToast,
}) => {
  const bulletins = [
    {
      id: 'BOL-SINAPROC-04',
      agency: 'SINAPROC Panamá',
      time: 'Hace 22 min',
      level: 'ALERTA ROJA',
      levelColor: 'bg-red-600 text-white',
      title: 'Aviso de Crecida Extraordinaria en Cuenca Baja del Río Tonosí',
      text: 'Debido a lluvias continuas en la cordillera occidental, el vado hacia Guánico Abajo queda temporalmente clausurado para vehículos livianos. Únicamente se permite el paso de convoyes humanitarios 4x4 y maquinaria pesada.',
    },
    {
      id: 'BOL-CRUZ-ROJA-02',
      agency: 'Cruz Roja Panameña',
      time: 'Hace 1h 05min',
      level: 'AVISO DE SALUD',
      levelColor: 'bg-[#006591] text-white',
      title: 'Puntos de Distribución de Agua Potable Clorada',
      text: 'Se han instalado plantas potabilizadoras móviles en la Plaza Central de Pedasí y en la Escuela Primaria de Tonosí. Cada familia censada con código QR puede retirar hasta 40 litros diarios.',
    },
    {
      id: 'BOL-OMNEX-09',
      agency: 'Red Operativa OMNEX Interior',
      time: 'Hace 2h 40min',
      level: 'INFORMATIVO',
      levelColor: 'bg-emerald-600 text-white',
      title: 'Brigadas Médicas en Territorio y Medicamentos Esenciales',
      text: 'Equipos de respuesta rápida con cuadrimotos cuentan con insulina en cadena de frío y sueros orales para el corregimiento de El Bebedero y zonas aledañas.',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold bg-sky-100 text-[#006591] px-2 py-0.5 rounded uppercase">
            Canal Oficial Verificado · Anti-Rumores
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Muro de Comunicaciones Humanitarias
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Boletines oficiales de emergencia para autoridades locales, albergues y comunidades de Los Santos y Herrera.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:103"
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Llamar SINAPROC (103)</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bulletins Feed */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {bulletins.map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${b.levelColor}`}>
                    {b.level}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{b.agency}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{b.time}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{b.text}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Identificador Oficial: {b.id}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verificado por COE Azuero
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar: Shelter Capacity & Safety Advisories */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-900 block pb-2 border-b border-slate-100">
              Capacidad de Albergues Habilitados
            </span>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Albergue Central Tonosí</span>
                <span className="font-mono text-red-600">92% Lleno</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="text-[10px] text-slate-500">184 / 200 personas alojadas</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Gimnasio Municipal Pedasí</span>
                <span className="font-mono text-emerald-700">45% Lleno</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-[10px] text-slate-500">68 / 150 personas alojadas</span>
            </div>
          </div>

          <div className="bg-[#131b2e] text-white p-5 rounded-xl border border-slate-800 shadow-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
              <Radio className="w-4 h-4" />
              <span>Frecuencias de Radio VHF de Socorro</span>
            </div>
            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span>SINAPROC Azuero:</span>
                <span className="text-white font-bold">146.520 MHz</span>
              </div>
              <div className="flex justify-between">
                <span>Cruz Roja Enlace:</span>
                <span className="text-white font-bold">147.100 MHz</span>
              </div>
              <div className="flex justify-between">
                <span>COE Emergencias:</span>
                <span className="text-white font-bold">145.350 MHz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
