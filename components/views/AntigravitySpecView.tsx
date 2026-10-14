'use client';

import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Download, 
  Check, 
  Play, 
  Layers, 
  Database, 
  Webhook, 
  Terminal, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import navigationFlow from '@/public/navigation_flow.json';

interface AntigravitySpecViewProps {
  onShowToast: (message: string, icon?: string) => void;
}

async function executeWebhookCall(payload: unknown) {
  const startTime = Date.now();
  const res = await fetch('/api/webhooks/mock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  const endTime = Date.now();
  return {
    status: res.status,
    data,
    timeMs: endTime - startTime,
  };
}

export const AntigravitySpecView: React.FC<AntigravitySpecViewProps> = ({
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'routes' | 'state' | 'webhooks' | 'agent'>('json');
  const [copied, setCopied] = useState(false);
  const [testLog, setTestLog] = useState<{
    webhookId: string;
    status: number;
    response: unknown;
    timeMs: number;
  } | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const jsonString = JSON.stringify(navigationFlow, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    onShowToast('navigation_flow.json copiado al portapapeles con éxito.', 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'navigation_flow.json';
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Archivo navigation_flow.json descargado para Antigravity 2.0.', 'download');
  };

  const handleSimulateWebhook = async (webhook: (typeof navigationFlow.n8nWebhookTriggers)[0]) => {
    setTestingId(webhook.id);
    try {
      const result = await executeWebhookCall(webhook.payloadSchema);
      setTestLog({
        webhookId: webhook.id,
        status: result.status,
        response: result.data,
        timeMs: result.timeMs,
      });
      onShowToast(`Simulación de ${webhook.id} ejecutada en ${result.timeMs}ms`, 'check');
    } catch (err) {
      setTestLog({
        webhookId: webhook.id,
        status: 500,
        response: { error: String(err) },
        timeMs: 0,
      });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded uppercase">
              Especificación Antigravity 2.0
            </span>
            <span className="text-[10px] font-mono text-slate-500">v2.0.4 Schema Standard</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Flujo Lógico & Navegación (navigation_flow.json)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Contrato técnico formal para que agentes de Antigravity 2.0 sinteticen la lógica, rutas, estado y webhooks n8n.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopyJson}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar JSON'}</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Descargar navigation_flow.json</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('json')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'json' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          JSON Crudo (navigation_flow.json)
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'routes' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rutas & Mapeo ({navigationFlow.routes.length})
        </button>
        <button
          onClick={() => setActiveTab('state')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'state' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Manejo de Estado ({navigationFlow.stateManagement.stores.length} Stores)
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'webhooks' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Triggers & Webhooks n8n ({navigationFlow.n8nWebhookTriggers.length})
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'agent' ? 'bg-[#006591] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Guía Antigravity 2.0
        </button>
      </div>

      {/* Tab 1: Raw JSON Viewer */}
      {activeTab === 'json' && (
        <div className="bg-[#131b2e] rounded-xl p-5 border border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>/public/navigation_flow.json</span>
            <span>{jsonString.split('\n').length} Líneas · RFC 8259 Standard</span>
          </div>
          <pre className="font-mono text-xs text-sky-200 leading-relaxed overflow-x-auto max-h-[600px] select-all">
            {jsonString}
          </pre>
        </div>
      )}

      {/* Tab 2: Routes Table */}
      {activeTab === 'routes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Rutas del Sistema OMNEX Conecta Interior</h3>
            <p className="text-xs text-slate-500">Mapeo de pantallas dinámicas y control de acceso RBAC.</p>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-2.5 px-4">ID Ruta</th>
                  <th className="py-2.5 px-4">Path</th>
                  <th className="py-2.5 px-4">Nombre de Pantalla</th>
                  <th className="py-2.5 px-4">Categoría</th>
                  <th className="py-2.5 px-4">Nivel RBAC</th>
                  <th className="py-2.5 px-4">Acciones & Triggers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {navigationFlow.routes.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.id}</td>
                    <td className="py-3 px-4 font-mono text-[#006591] font-semibold">{r.path}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{r.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-[#006591] border border-sky-200">
                        Nivel {r.rbacLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {r.actions.map((a, i) => (
                        <div key={i} className="font-mono text-[10px]">
                          • {a.name} ({a.type})
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: State Management Stores */}
      {activeTab === 'state' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {navigationFlow.stateManagement.stores.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-900">{s.id}</span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {s.storageType}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">{s.description}</p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Esquema de Campos:
                  </span>
                  <pre className="font-mono text-[11px] text-slate-700 overflow-x-auto">
                    {JSON.stringify(s.schema, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Triggers & Webhooks n8n */}
      {activeTab === 'webhooks' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            {navigationFlow.n8nWebhookTriggers.map((wh) => (
              <div key={wh.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                      {wh.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">{wh.id}</span>
                    <span className="text-xs font-bold text-slate-700">· {wh.name}</span>
                  </div>

                  <button
                    onClick={() => handleSimulateWebhook(wh)}
                    disabled={testingId === wh.id}
                    className="px-3 py-1.5 rounded-lg bg-[#006591] hover:bg-[#004e70] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{testingId === wh.id ? 'Ejecutando...' : 'Simular Trigger'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-sans block mb-1">
                      Endpoint Placeholder & Origen UI:
                    </span>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-700">
                      <div>URL: <strong className="text-slate-900">{wh.urlPlaceholder}</strong></div>
                      <div>Ruta: <span className="text-[#006591]">{wh.sourceRoute}</span></div>
                      <div>Elemento: <span className="text-slate-500">{wh.uiTriggerElement}</span></div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-sans block mb-1">
                      Payload JSON de Muestra:
                    </span>
                    <pre className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-700 overflow-x-auto max-h-24">
                      {JSON.stringify(wh.payloadSchema, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Test log console */}
          {testLog && (
            <div className="bg-[#131b2e] rounded-xl p-5 border border-slate-800 text-white flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">Resultado de Ejecución Mock · Webhook: {testLog.webhookId}</span>
                </div>
                <span>Latencia: {testLog.timeMs}ms · Status: {testLog.status}</span>
              </div>
              <pre className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-sky-300 overflow-x-auto">
                {JSON.stringify(testLog.response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Agent Antigravity Guidelines */}
      {activeTab === 'agent' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-900">
            Pauta de Implementación Inmediata para Antigravity 2.0
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Esta especificación técnica se diseñó para que un agente autónomo de ingeniería de software implemente la lógica dinámica de OMNEX Conecta Interior sin ambigüedades.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 font-bold block mb-1">Paso 1: Enrutamiento y Shell</strong>
              <p className="text-slate-600">
                {navigationFlow.antigravityImplementationNotes.step1_routing}
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 font-bold block mb-1">Paso 2: Manejo de Estado & Offline-First</strong>
              <p className="text-slate-600">
                {navigationFlow.antigravityImplementationNotes.step2_state}
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 font-bold block mb-1">Paso 3: Navegación Waze Deep Link</strong>
              <p className="text-slate-600">
                {navigationFlow.antigravityImplementationNotes.step3_waze}
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 font-bold block mb-1">Paso 4: Privacidad Ley 81 de Panamá</strong>
              <p className="text-slate-600">
                {navigationFlow.antigravityImplementationNotes.step4_security}
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 font-bold block mb-1">Paso 5: Orquestación n8n Webhooks</strong>
              <p className="text-slate-600">
                {navigationFlow.antigravityImplementationNotes.step5_n8n_placeholders}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
