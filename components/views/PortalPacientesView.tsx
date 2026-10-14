'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  UserPlus, 
  FileText 
} from 'lucide-react';
import { purgeFamilyData } from '@/lib/storage';
import { ActiveView } from '@/types';

interface PortalPacientesViewProps {
  onNavigate: (view: ActiveView) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const PortalPacientesView: React.FC<PortalPacientesViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [searchCode, setSearchCode] = useState('FAM-PTI-042');
  const [familyFound, setFamilyFound] = useState(true);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [purgeCertificate, setPurgeCertificate] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim().toUpperCase() === 'FAM-PTI-042') {
      setFamilyFound(true);
      onShowToast('Ficha de núcleo familiar FAM-PTI-042 localizada con éxito.', 'check');
    } else {
      setFamilyFound(false);
      onShowToast(`No se encontró registro para el código ${searchCode}.`, 'alert');
    }
  };

  const handleExecutePurgeARCO = async () => {
    try {
      // Dispatches n8n webhook placeholder
      const res = await fetch('/api/webhooks/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'ARCO_DATA_PURGE_REQUEST',
          familyCode: 'FAM-PTI-042',
          lawArticle: 'Ley 81 de 2019 - Art. 12 (Derecho de Cancelación)',
          reason: 'SOLICITUD_EXPRESA_TITULAR',
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      const certNo = data.certificateNumber || 'CDD-PAN-2026-ARCO-042';
      setPurgeCertificate(certNo);
      purgeFamilyData('FAM-PTI-042');
      setPurgeSuccess(true);
      onShowToast('Datos personales eliminados bajo el Art. 12 de la Ley 81.', 'trash');
    } catch {
      purgeFamilyData('FAM-PTI-042');
      setPurgeCertificate('CDD-PAN-2026-ARCO-042-OFFLINE');
      setPurgeSuccess(true);
      onShowToast('Datos personales purgados localmente.', 'trash');
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold bg-sky-100 text-[#006591] px-2 py-0.5 rounded uppercase">
              OMNEX Interior · Ley 81
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Portal de Pacientes & Beneficiarios
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta del estado de asistencia de emergencia, raciones asignadas y ejercicio garantizado de Derechos ARCO.
          </p>
        </div>

        <button
          onClick={() => onNavigate('censo-offline')}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4 text-sky-400" />
          <span>Registrar Nuevo Paciente / Familia</span>
        </button>
      </div>

      {/* Lookup Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6">
        <span className="text-xs font-bold text-slate-800 block mb-2">
          Buscar Núcleo Familiar por Código Único
        </span>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Ej. FAM-PTI-042"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono font-bold pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006591]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#006591] hover:bg-[#004e70] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Consultar Ficha
          </button>
        </form>
      </div>

      {familyFound ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Record Card */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#006591] uppercase tracking-wider">
                  Ficha Humanitaria Activa
                </span>
                <h2 className="text-xl font-bold font-mono text-slate-900">
                  FAM-PTI-042 · Pedasí / Oria Arriba
                </h2>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                ASIGNACIÓN APROBADA
              </span>
            </div>

            {/* Demographics details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-sans block">Niños (0-12)</span>
                <span className="text-base font-bold text-slate-900">1</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-sans block">Adolescentes</span>
                <span className="text-base font-bold text-slate-900">0</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-sans block">Adultos</span>
                <span className="text-base font-bold text-slate-900">2</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-sans block">Adultos Mayores</span>
                <span className="text-base font-bold text-slate-900">1</span>
              </div>
            </div>

            {/* Allocated Rations */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Insumos Asignados por Brigada OMNEX:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                  <span className="font-bold text-slate-900 block">Agua Potable 20L</span>
                  <span className="text-[11px] text-slate-500">2 Garrafones con filtro</span>
                </div>
                <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                  <span className="font-bold text-slate-900 block">Ración Familiar 7D</span>
                  <span className="text-[11px] text-slate-500">Alimentos no perecederos</span>
                </div>
                <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                  <span className="font-bold text-slate-900 block">Kit Pediátrico</span>
                  <span className="text-[11px] text-slate-500">Fórmula y pañales</span>
                </div>
              </div>
            </div>

            {/* Ley 81 Rights Callout */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Tus Derechos ARCO bajo la Ley 81 de Panamá
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Tienes derecho en cualquier momento a solicitar el Acceso, Rectificación, Cancelación u Oposición del tratamiento de tus datos familiares.
                </p>
              </div>

              {/* CRITICAL BUTTON: ELIMINAR MIS DATOS */}
              <button
                type="button"
                onClick={() => setShowPurgeModal(true)}
                className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar mis datos</span>
              </button>
            </div>
          </div>

          {/* Right Card: Credential & Download */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-900 block pb-2 border-b border-slate-100">
              Credencial Cifrada de Asignación
            </span>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="font-mono text-sm font-bold text-slate-900">PTI-042-99824X</span>
              <span className="text-[10px] text-slate-400 mt-0.5">JWT Token Firmado ECC-P256</span>
              <div className="w-full flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold mt-3 bg-white p-2 rounded-lg border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Listo para Escaneo en Terreno</span>
              </div>
            </div>

            <button
              onClick={() => onShowToast('Descargando comprobante oficial de asignación cifrada...', 'download')}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <Download className="w-3.5 h-3.5 text-[#006591]" />
              <span>Descargar Comprobante Seguro</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron registros</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Verifique que el código comience por FAM- o registre un nuevo núcleo familiar en el módulo de censo.
          </p>
        </div>
      )}

      {/* ARCO Purge Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
            {!purgeSuccess ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 self-center">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">
                    ¿Confirmas el Derecho de Cancelación ARCO?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Conforme al Art. 12 de la Ley 81 de Panamá, esta acción eliminará tus datos personales de las bóvedas de OMNEX y de la cola local de tabletas, notificando al webhook de n8n para purga inmutable.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-600">
                  <div>Titular: Eulogio Melgar Cedeño</div>
                  <div>Código: FAM-PTI-042</div>
                  <div>Cédula Audit: 7-702-****</div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowPurgeModal(false)}
                    className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePurgeARCO}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
                  >
                    Confirmar Purga
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 self-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-bold text-slate-900">
                    Datos Purgados con Éxito
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Se ha emitido el Acta Criptográfica de Destrucción ante ANTAI Panamá.
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-mono text-emerald-800 text-center font-bold">
                  Certificado: {purgeCertificate}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPurgeModal(false);
                    setPurgeSuccess(false);
                    setFamilyFound(false);
                  }}
                  className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
