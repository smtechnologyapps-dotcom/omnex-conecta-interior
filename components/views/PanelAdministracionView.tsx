'use client';

import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Database, 
  Key, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  Activity, 
  Boxes 
} from 'lucide-react';

interface PanelAdministracionViewProps {
  onShowToast: (message: string, icon?: string) => void;
}

export const PanelAdministracionView: React.FC<PanelAdministracionViewProps> = ({
  onShowToast,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handlePingWebhooks = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/webhooks/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'PING_HEALTH_TEST',
          nodeId: '#PAN-AZ-04',
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setPingResult(`200 OK · Webhook n8n responde en 38ms (Reconciliador Activo)`);
      onShowToast('Webhooks de n8n verificados con éxito (38ms).', 'check');
    } catch {
      setPingResult('Simulado: Conectividad local fallback.');
    } finally {
      setIsPinging(false);
    }
  };

  const handleRotateKey = () => {
    onShowToast('Clave de firma RS-256 rotada exitosamente. Tokens anteriores mantienen validez hasta EXP.', 'key');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded uppercase">
            Junta Técnica OMNEX · Dirección Ejecutiva
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Panel de Administración & Auditoría Central
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisión institucional de cuotas de suministros, integraciones con n8n y seguridad criptográfica.
          </p>
        </div>

        <button
          onClick={handlePingWebhooks}
          disabled={isPinging}
          className="px-4 py-2 rounded-lg bg-[#006591] hover:bg-[#004e70] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs self-start md:self-auto"
        >
          <Activity className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>Probar Conectividad n8n</span>
        </button>
      </div>

      {pingResult && (
        <div className="mb-6 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{pingResult}</span>
        </div>
      )}

      {/* Inventory Quotas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Agua Potable en Bodega
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            24,800 L
          </span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#006591] h-full rounded-full" style={{ width: '74%' }}></div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">74% de reserva estratégica</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Kits Familiares 7D
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            1,850 Raciones
          </span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '62%' }}></div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">62% de inventario</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Kits Pediátricos / Leche
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            420 Kits
          </span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '38%' }}></div>
          </div>
          <span className="text-[10px] text-amber-700 font-mono mt-1 block">38% (Reposición urgente)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Combustible Diesel 4x4
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
            1,200 Galones
          </span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-slate-900 h-full rounded-full" style={{ width: '80%' }}></div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Tanques seguros en Las Tablas</span>
        </div>
      </div>

      {/* Security & Webhook Setup Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-[#006591]" />
              <h3 className="text-sm font-bold text-slate-900">Seguridad & Rotación Criptográfica</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Gestión de llaves asimétricas para la firma de tokens efímeros QR conforme al protocolo de quema atómica.
            </p>

            <div className="space-y-2 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Algoritmo Maestro:</span>
                <span className="font-bold text-slate-900">HMAC-SHA256 / RS-256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Última Rotación:</span>
                <span className="text-slate-900">2026-10-10 08:00 UTC-5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Próxima Expiración:</span>
                <span className="text-emerald-700 font-bold">En 11 Días</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Enclave Seguro HSM Activo</span>
            <button
              onClick={handleRotateKey}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors border border-slate-200"
            >
              Rotar Llave Maestra
            </button>
          </div>
        </div>

        {/* Webhook Endpoints Config */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-[#006591]" />
              <h3 className="text-sm font-bold text-slate-900">Endpoints de Automatización n8n</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Webhooks configurados para reconciliación de censo y sincronización hacia Supabase PostgreSQL.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">POST /webhook/v1/census-intake</span>
                <span className="text-emerald-700 font-bold">200 OK</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">POST /webhook/v1/batch-reconcile</span>
                <span className="text-emerald-700 font-bold">200 OK</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">POST /webhook/v1/burn-token-dispatch</span>
                <span className="text-emerald-700 font-bold">200 OK</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Cluster: Supabase Panama Edge</span>
            <span className="text-emerald-700 font-bold">SLA: 99.98%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
