'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Shield, 
  Navigation, 
  Layers, 
  MapPin, 
  Activity, 
  Radio, 
  Truck, 
  FileText, 
  PhoneCall, 
  ExternalLink,
  PlusCircle,
  Clock
} from 'lucide-react';
import { ActiveView } from '@/types';

interface CentroDeMandoViewProps {
  onNavigate: (view: ActiveView) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const CentroDeMandoView: React.FC<CentroDeMandoViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [selectedZone, setSelectedZone] = useState<'all' | 'tonosi' | 'pedasi' | 'macaracas'>('all');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const handleAssignUnit = () => {
    onShowToast('Nueva unidad 4x4 Hilux asignada a cuadrante Tonosí Sur vía n8n webhook', 'truck');
  };

  const handleDownloadManifest = () => {
    onShowToast('Generando Planilla Oficial de Carga y Manifiesto de Despacho (PDF firmado)...', 'file_text');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Breadcrumb & Threat Marquee */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="font-bold text-slate-800">PANAMÁ</span>
          <span>/</span>
          <span>REGIÓN CENTRAL (AZUERO)</span>
          <span>/</span>
          <span className="text-[#006591] font-bold">LOS SANTOS & HERRERA</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-200 font-mono text-[10px] text-slate-800 font-bold uppercase">
            Zona Operativa 07
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>Alerta Hidrometeorológica Río Tonosí</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
            <Shield className="w-3.5 h-3.5 text-[#006591]" />
            <span>Ley 81: Anonimización Activa</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-semibold">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>n8n Supabase: SYNC 98.4%</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Critical Operational KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Censo Territorial Total
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">1,420</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +14 hoy
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#006591]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs font-mono text-slate-600">
              <span>IndexedDB: <strong>1,420 (98%)</strong></span>
              <span className="text-[#006591] font-bold">n8n Sync: 1,380</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#006591] h-full rounded-full" style={{ width: '97.1%' }}></div>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Verificación Cripto QR (JWT)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">87.2%</span>
                <span className="text-xs font-medium text-slate-500">1,238 paquetes</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-[#006591]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Hash Anti-Duplicado</span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
              SHA256 Sig OK
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-xs flex flex-col justify-between bg-red-50/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Urgencia Crítica (&lt;24h)
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-red-600 font-mono">42</span>
                <span className="text-xs font-medium text-red-700">Familias en Riesgo</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-700">Tonosí (26) · Macaracas (11) · Pedasí (5)</span>
            <button 
              onClick={() => onNavigate('censo-offline')}
              className="text-red-700 font-bold uppercase underline hover:text-red-900"
            >
              Despachar
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Gobernanza & Privacidad
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">100%</span>
                <span className="text-xs font-medium text-slate-500">Ley 81 R.P.</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#006591]">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Datos Sensibles:</span>
            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              HASHED/MASKED
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Geospatial Command Map & Corregimiento Telemetry */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* Left: Map Canvas */}
        <div className="xl:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Mapeo Territorial de Afectación & Triage
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoreo satelital y capas de aislamiento por crecida de cuencas en Los Santos
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedZone('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedZone === 'all' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos (Azuero)
              </button>
              <button
                onClick={() => setSelectedZone('tonosi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedZone === 'tonosi' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tonosí
              </button>
              <button
                onClick={() => setSelectedZone('pedasi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedZone === 'pedasi' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pedasí
              </button>
              <button
                onClick={() => setSelectedZone('macaracas')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedZone === 'macaracas' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Macaracas
              </button>
            </div>
          </div>

          {/* Interactive Tactical Map Container */}
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden mt-4 bg-slate-900 border border-slate-800">
            {/* Visual satellite stylized background */}
            <div 
              className="w-full h-full bg-cover bg-center opacity-85 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB6crFJoXdOx6sAg5xLTtbEUyuWeo3PxTwHVeF6cCim5LXppN7Ep74kap52kzd1oNv031j5ZFVOTfLzqxLXGPuLYb7HubaMNSHzMZ4KaJtR2dosXOLgy7XgkGLgH28TRqIsiqBeK_AFEgpvOAs9nm2vYBIW9Eh_SYtrJ6EhGYSluRHSIxHR4BJpaOIEeIv2EwpGL0NI-BN2Qv43i_h7hV9kisSIgx6m7y78uUhqGFVts7LK0BsUwONc3g')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none"></div>

            {/* Tactical Legend Top-Left */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md flex flex-col gap-1.5 z-10 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                Semáforo de Afectación
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span className="text-slate-700 font-medium">Crítico (&lt;24h) Desabastecido</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span className="text-slate-700 font-medium">En Ruta / Despacho 4x4</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700 font-medium">Atendido / Suministro OK</span>
              </div>
            </div>

            {/* Interactive Hotspot 1: Tonosí - Guánico */}
            <div 
              className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              onClick={() => setActiveHotspot(activeHotspot === 'tonosi' ? null : 'tonosi')}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-9 h-9 rounded-full bg-red-600/40 animate-ping"></span>
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
                  26
                </div>
              </div>
              {activeHotspot === 'tonosi' && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 rounded-lg shadow-xl w-56 border border-slate-700 z-30">
                  <span className="text-xs font-bold text-sky-400 block">Tonosí - Guánico / El Cacao</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">
                    Corte de vado por crecida del río. 26 familias sin víveres ni agua potable.
                  </span>
                  <a
                    href="https://waze.com/ul?ll=7.4166,-80.4500&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 underline"
                  >
                    <Navigation className="w-3 h-3" />
                    Abrir en Waze (Ruta SOS)
                  </a>
                </div>
              )}
            </div>

            {/* Interactive Hotspot 2: Pedasí - Oria Arriba */}
            <div 
              className="absolute bottom-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              onClick={() => setActiveHotspot(activeHotspot === 'pedasi' ? null : 'pedasi')}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-7 h-7 rounded-full bg-sky-500/40 animate-ping"></span>
                <div className="w-8 h-8 rounded-full bg-[#006591] text-white flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
                  11
                </div>
              </div>
              {activeHotspot === 'pedasi' && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 rounded-lg shadow-xl w-56 border border-slate-700 z-30">
                  <span className="text-xs font-bold text-sky-400 block">Pedasí - Oria Arriba</span>
                  <span className="text-[11px] text-slate-300 mt-1 block">
                    Unidad 4x4 en camino con víveres y kits pediátricos.
                  </span>
                  <a
                    href="https://waze.com/ul?ll=7.5333,-80.0333&navigate=yes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-sky-300 underline"
                  >
                    <Navigation className="w-3 h-3" />
                    Abrir en Waze (Ruta Segura)
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Floating Route Bar with Waze Direct GPS Action */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/95 text-white p-3.5 rounded-xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white leading-tight">
                      Ruta Crítica: Las Tablas → Pedasí → Tonosí
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-600 text-[10px] font-mono text-white font-bold">
                      Alerta de Vado
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Camino rural Oria Arriba con fango denso. Requiere tracción 4x4 bloqueada.
                  </p>
                </div>
              </div>

              {/* Direct Waze Action Button */}
              <a
                href="https://waze.com/ul?ll=7.5333,-80.0333&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#39b8fd] hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navegar con Waze (Rutas Rurales Seguras)</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Bottom Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-2">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Puntos de Corte</span>
                <span className="text-sm font-bold text-slate-900 font-mono">3 Vados Anegados</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-red-200 flex items-center justify-center text-red-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-red-600 block">Caudal Río Tonosí</span>
                <span className="text-sm font-bold text-red-700 font-mono">+2.8m (Crítico)</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-700">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Brigadas en Tránsito</span>
                <span className="text-sm font-bold text-slate-900 font-mono">4 Unidades 4x4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Triage por Corregimiento */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Triage por Corregimiento</h3>
              <span className="font-mono text-xs text-slate-500">Prov. Los Santos</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Zonas priorizadas por índice de vulnerabilidad y acceso vial post-sismo.
            </p>

            {/* Card 1: Guánico / El Cacao */}
            <div className="p-3.5 rounded-lg bg-red-50/60 border border-red-200 mb-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  <span className="text-sm font-bold text-slate-900">Guánico / El Cacao</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-mono font-bold uppercase">
                  Crítico &lt;24h
                </span>
              </div>
              <span className="text-xs text-slate-600">Distrito: Tonosí · 26 familias desabastecidas</span>
              <div className="flex items-center justify-between text-xs font-mono text-slate-700 bg-white/70 p-2 rounded">
                <span>Agua: <strong>Agotada</strong></span>
                <span>Acceso: <strong>Solo 4x4 / Tractor</strong></span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <a
                  href="https://waze.com/ul?ll=7.4166,-80.4500&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold text-center flex items-center justify-center gap-1 hover:bg-slate-800 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-400" />
                  Waze a El Cacao
                </a>
                <button
                  onClick={() => onNavigate('censo-offline')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Ver Censo
                </button>
              </div>
            </div>

            {/* Card 2: Oria Arriba */}
            <div className="p-3.5 rounded-lg bg-sky-50/60 border border-sky-200 mb-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                  <span className="text-sm font-bold text-slate-900">Oria Arriba</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-sky-100 text-[#006591] text-[10px] font-mono font-bold uppercase border border-sky-300">
                  En Proceso
                </span>
              </div>
              <span className="text-xs text-slate-600">Distrito: Pedasí · 11 familias en censo de entrega</span>
              <div className="flex items-center justify-between text-xs font-mono text-slate-700 bg-white/70 p-2 rounded">
                <span>Suministros: <strong>En Camino</strong></span>
                <span>Camioneta #04: <strong>A 18 min</strong></span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <a
                  href="https://waze.com/ul?ll=7.5333,-80.0333&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold text-center flex items-center justify-center gap-1 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#006591]" />
                  Waze a Oria Arriba
                </a>
                <button
                  onClick={() => onNavigate('despacho-qr')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Validar QR
                </button>
              </div>
            </div>

            {/* Card 3: Pedasí Cabecera */}
            <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-sm font-bold text-slate-900">Pedasí Cabecera</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase border border-emerald-300">
                  Completado
                </span>
              </div>
              <span className="text-xs text-slate-600">Distrito: Pedasí · 180 paquetes entregados con token JWT</span>
              <div className="flex items-center justify-between text-xs font-mono text-slate-700 bg-white/70 p-2 rounded">
                <span>Censo Ley 81: <strong>Sincronizado</strong></span>
                <span>Estado: <strong>Seguro</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Notice Box */}
          <div className="bg-[#131b2e] text-white p-4 rounded-xl shadow-xs border border-slate-800 flex items-start gap-3">
            <Radio className="w-5 h-5 text-[#39b8fd] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#89ceff] block">Protocolo Terrestre Interior</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Las rutas de Waze integran alertas de crecidas emitidas por SINAPROC Azuero. Ante pérdida total de LTE, continúe el censo en IndexedDB.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: n8n Sync Monitor & Off-Road Fleet */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* Sync Panel Left */}
        <div className="xl:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#006591]" />
                <h3 className="text-base font-bold text-slate-900">Motor de Sincronización n8n & Supabase</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                WebSocket Activo
              </span>
            </div>
            <p className="text-xs text-slate-500 my-3">
              Latencia punto a punto entre la cola IndexedDB del PWA en tabletas de campo y el cluster central de Supabase.
            </p>

            {/* Sparkline Graphic */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600">Latencia de Red (Últimos 15 min)</span>
                <span className="font-mono text-xs font-bold text-slate-800">Promedio: 42ms</span>
              </div>
              <div className="w-full h-16">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 70">
                  <defs>
                    <linearGradient id="syncGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#006591" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#006591" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,55 Q 25,45 50,50 T 100,25 T 150,40 T 200,18 T 250,30 T 300,20 L 300,70 L 0,70 Z" fill="url(#syncGrad)" />
                  <path d="M 0,55 Q 25,45 50,50 T 100,25 T 150,40 T 200,18 T 250,30 T 300,20" fill="none" stroke="#006591" strokeWidth="2.5" />
                  <circle cx="200" cy="18" fill="#006591" r="3.5" />
                  <circle cx="300" cy="20" fill="#39b8fd" r="3.5" />
                </svg>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1">
                <span>14:00 (Pérdida Señal Tonosí)</span>
                <span>14:07 (Reconexión LTE)</span>
                <span>Ahora</span>
              </div>
            </div>

            {/* Offline Queues by Brigade */}
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Cola en IndexedDB por Brigada
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800">Brigada 01 (Las Tablas)</span>
                <span className="font-mono text-emerald-700 font-bold">0 pendientes · AL DÍA</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/70 border border-red-200 text-xs">
                <span className="font-bold text-red-900">Brigada 03 (Tonosí Rural)</span>
                <span className="font-mono text-red-700 font-bold">24 fichas retenidas en PWA · SIN LTE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50/70 border border-sky-200 text-xs">
                <span className="font-bold text-sky-900">Brigada 05 (Macaracas)</span>
                <span className="font-mono text-[#006591] font-bold">2 registros procesando · SYNC EN VIVO</span>
              </div>
            </div>
          </div>

          {/* Quick Speed Dial Dialpad */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Marcación de Emergencia Directa (Panamá)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="tel:103"
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center transition-colors shadow-xs"
              >
                <span className="font-mono font-bold text-base leading-none">103</span>
                <span className="text-[10px] uppercase font-semibold mt-1">SINAPROC</span>
              </a>
              <a
                href="tel:118"
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center transition-colors shadow-xs"
              >
                <span className="font-mono font-bold text-base leading-none">118</span>
                <span className="text-[10px] uppercase font-semibold mt-1">Cruz Roja</span>
              </a>
              <a
                href="tel:104"
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center transition-colors shadow-xs"
              >
                <span className="font-mono font-bold text-base leading-none">104</span>
                <span className="text-[10px] uppercase font-semibold mt-1">Bomberos</span>
              </a>
            </div>
          </div>
        </div>

        {/* Fleet Table Right */}
        <div className="xl:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Unidades Todoterreno en Despacho</h3>
                <p className="text-xs text-slate-500">Flota de rescate, transporte de víveres y kits médicos</p>
              </div>
              <button
                onClick={handleAssignUnit}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Asignar Nueva Unidad</span>
              </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto mt-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-2.5 px-3 rounded-l-md">Unidad Móvil</th>
                    <th className="py-2.5 px-3">Ruta Asignada</th>
                    <th className="py-2.5 px-3">Carga / Misión</th>
                    <th className="py-2.5 px-3">Telemetría</th>
                    <th className="py-2.5 px-3 text-right rounded-r-md">Navegación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">4x4 Hilux #02</div>
                      <div className="text-[11px] text-slate-500 font-mono">Chófer: C. Morales</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">Las Tablas → Pedasí</div>
                      <div className="text-[11px] text-slate-500">Vía Carretera Principal</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900">45 Kits Fam.</span>
                      <span className="block text-[10px] text-slate-500">Agua + Alimentos Secos</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 4G OK
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href="https://waze.com/ul?ll=7.5333,-80.0333&navigate=yes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-[#006591]" />
                        Waze
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-3 px-3">
                      <div className="font-bold text-red-900">Tractor Anfibio #01</div>
                      <div className="text-[11px] text-slate-500 font-mono">Chófer: E. Mendoza</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-red-700">Vado Río Tonosí Sur</div>
                      <div className="text-[11px] text-red-600">Cruza vado anegado</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900">60 Gal. Agua</span>
                      <span className="block text-[10px] text-red-700 font-semibold">Prioridad Nivel 1</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-mono text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Satelital
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href="https://waze.com/ul?ll=7.4166,-80.4500&navigate=yes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#39b8fd] hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition-colors"
                      >
                        <Navigation className="w-3 h-3" />
                        Ruta SOS
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Camión Isuzu 4x4 #03</div>
                      <div className="text-[11px] text-slate-500 font-mono">Chófer: M. Domínguez</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">Chitré → Macaracas</div>
                      <div className="text-[11px] text-slate-500">Ruta Alta de Colinas</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900">120 Kits Hig.</span>
                      <span className="block text-[10px] text-slate-500">Infantes y Adultos</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> 3G Intermitente
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href="https://waze.com/ul?ll=7.7167,-80.5333&navigate=yes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-[#006591]" />
                        Waze
                      </a>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Cuadrimoto Médica #01</div>
                      <div className="text-[11px] text-slate-500 font-mono">Paramédico: L. Vega</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">Sendero El Cacao</div>
                      <div className="text-[11px] text-slate-500">Acceso Peatonal Estrecho</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900">Insulina & Sueros</span>
                      <span className="block text-[10px] text-slate-500">Cadena de Frío</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Radio VHF
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href="https://waze.com/ul?ll=7.4166,-80.4500&navigate=yes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors"
                      >
                        <Navigation className="w-3 h-3 text-[#006591]" />
                        Waze
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#006591]" />
              <span>Todos los despachos generan token JWT con firma criptográfica local.</span>
            </div>
            <button
              onClick={handleDownloadManifest}
              className="px-3.5 py-2 rounded-lg bg-[#006591] hover:bg-[#004e70] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generar Planilla de Carga (PDF Seguro)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: Field Telemetry & Visual Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="h-40 w-full relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaEhnk0oSt0d-mqd25luzxZi-56V1uZIZF_FqKmpJqhZziueMoHTTZymiWF66Iz8YWw1MOEhGYXx_gvz4nVx2jobwTJ3r4F92V6BMLCMscH-e8k3XpkschQCNjPKP2WYC4JOfqj90EUr58O5ncLZ-cye0Vu2laC8l6H65WKcRCP4_bEViI2vnw-yudSSHYu3ahlBmBCBljAbrRBQI_co1zfBWSWVJZ82G3hObc7DqBL3jl8YvbYHnnIA"
              alt="4x4 pickup navigating muddy roads in Azuero Panama"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[10px] font-bold uppercase">
              Tonosí · Sector Vado
            </span>
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Reporte Visual #089</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Crecida de Río en Carretera a El Cacao</h4>
              <p className="text-xs text-slate-600 mt-1">
                Nivel del agua sobrepasa los 60 cm en el paso de vado. Únicamente vehículos pesados autorizados para cruzar.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-100">
              <span>Operador: Juan V.</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hace 28 min</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="h-40 w-full relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhRgo-2FcQ5NuTCdCV4mTVP38difZFmHV66E-SQ9cCwMjtHGh8jj6jPfzo2Fh8mYVP9EfuH_RB5-dEDJ55557FuXRkC4vtqKKZx0PZh49xiBkVTqXd7W3pjukcNbiUuKHzL1V3EAQdNPv_BXYzOIsLHvXG8FJH1Nx1_myIiZLtxYt0X2OjD7ZF-f0DeLsOFowR0E8MaudtwkTz-pzKZn43s6qBCjs5TE8pAYVL1-CnqNxCkSbGajXX3A"
              alt="Field volunteer scanning QR code in rural Panama"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[10px] font-bold uppercase">
              Pedasí · Oria Arriba
            </span>
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Validación Cripto</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Entrega Verificada con Token JWT</h4>
              <p className="text-xs text-slate-600 mt-1">
                Kits de alimentos entregados sin duplicidad. Firma tokenizada almacenada en IndexedDB con anonimización Ley 81.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-100">
              <span>Operador: Sofía R.</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hace 1h 14min</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="h-40 w-full relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLfmOWpZ-YsARZY8UUqhprRjMVUjvkjWLqFoVCv1sL7-FfIXFHuYeTRbHDIcA7GkEJLG3aN_1r8bIuAH4_SzAUgzJX7LlV0vDu4HbBrjl9KecyZtSMFNHdNx-gAZU4uq5D6C5Fw_9VO8RZp3COuQolEon87Qdfxy_3ctrUldGr4_XSY_dahGjZXpyNW9VxQhUkirXuYRY5QVLKGIlINTtk88pJNFI-oUalCOE-05tR69gr1EaTklSb9g"
              alt="Humanitarian staging warehouse in Las Tablas"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[10px] font-bold uppercase">
              Centro Las Tablas
            </span>
          </div>
          <div className="p-4 flex flex-col justify-between flex-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hub Logístico Central</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Llegada de Ración Adicional SINAPROC</h4>
              <p className="text-xs text-slate-600 mt-1">
                200 bultos de asistencia médica clasificados y encolados en el gestor n8n para asignación de ruta hacia Macaracas.
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-100">
              <span>Supervisor: L. Batista</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hace 2h 05min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
