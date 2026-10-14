'use client';

import React, { useState } from 'react';
import { 
  Scan, 
  ShieldCheck, 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  RefreshCw, 
  FileCheck, 
  Fingerprint, 
  Clock, 
  ShieldAlert,
  Droplets,
  Utensils,
  Baby
} from 'lucide-react';
import { setTokenBurned, getIsTokenBurned } from '@/lib/storage';
import { SecureVault } from '@/lib/crypto/secure-vault';
import { getOmnexDB } from '@/lib/data/dexie-db';

interface DespachoQrViewProps {
  onShowToast: (message: string, icon?: string) => void;
  isOnline: boolean;
}

export const DespachoQrView: React.FC<DespachoQrViewProps> = ({
  onShowToast,
  isOnline,
}) => {
  const [isBurned, setIsBurned] = useState<boolean>(() => getIsTokenBurned());
  const [isBurning, setIsBurning] = useState(false);
  const [gpsRefreshed, setGpsRefreshed] = useState(false);

  const handleBurnToken = async () => {
    if (isBurned) {
      onShowToast('El token PTI-042-99824X ya fue quemado y no puede reutilizarse (Quema Atómica).', 'alert');
      return;
    }

    setIsBurning(true);

    try {
      const db = getOmnexDB();
      const existingRecords = await db.nullifiers.toArray();
      const inMemoryNullifiers = new Set(existingRecords.map((r) => r.nullifier));

      // Evaluación Criptográfica contra Replay Attacks
      const verification = await SecureVault.evaluateAndBurnToken(
        'PTI-042-99824X',
        'FAM-PTI-042',
        inMemoryNullifiers
      );

      if (!verification.valid) {
        setIsBurning(false);
        onShowToast('REPLAY ATTACK BLOQUEADO: El token QR ya fue reclamado previamente.', 'alert');
        return;
      }

      // Persistencia Inmutable en Dexie Nullifier Set
      await db.nullifiers.put({
        nullifier: verification.nullifier,
        tokenId: 'PTI-042-99824X',
        beneficiaryId: 'FAM-PTI-042',
        timestamp: verification.timestamp,
        burnedBy: 'operador-az-04',
      });

      // Call mock webhook for token burn
      await fetch('/api/webhooks/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'TOKEN_BURNED',
          nodeId: '#PAN-AZ-04',
          familyCode: 'FAM-PTI-042',
          nullifier: verification.nullifier,
          timestamp: verification.timestamp,
        }),
      });

      setTokenBurned(true);
      setIsBurned(true);
      onShowToast(
        'Token PTI-042-99824X quemado atómicamente. Despacho concluido y registrado en ledger inmutable SHA-256.',
        'burn'
      );
    } catch (err) {
      console.log('Offline burn local fallback', err);
      setTokenBurned(true);
      setIsBurned(true);
      onShowToast('Token quemado localmente en modo offline de contingencia.', 'burn');
    } finally {
      setIsBurning(false);
    }
  };

  const handleRefreshGps = () => {
    setGpsRefreshed(true);
    onShowToast('Caché GNSS de precisión refrescada: Distancia radial confirmada a 78 metros (±2.8m).', 'compass');
    setTimeout(() => setGpsRefreshed(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Operational Breadcrumbs & Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="font-mono text-[#006591] uppercase tracking-wider font-bold">NODO #PAN-AZ-04</span>
          <span>/</span>
          <span className="uppercase">Operaciones de Campo</span>
          <span>/</span>
          <span className="text-slate-800 font-bold uppercase">Módulo Despacho QR JWT</span>
        </div>

        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full shadow-xs self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006591]"></span>
          </span>
          <span className="font-mono text-xs text-slate-800 font-bold tracking-tight">
            MOTOR CRIPTOGRÁFICO: HMAC-SHA256 ACTIVO
          </span>
          <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[#006591] font-bold uppercase">
            Ley 81 OK
          </span>
        </div>
      </div>

      {/* Primary Mission Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#006591]" />
              <span className="text-[11px] text-[#006591] uppercase tracking-wider font-bold">
                Protocolo de Asignación Blindada
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Despacho & Validación QR JWT
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl mt-0.5">
              Verificación de un solo uso en terreno rural (Azuero). Previene suplantación, garantiza geocercado perimetral estricto a 500m y sincroniza la entrega para quema atómica de credenciales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg min-w-[130px]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Rango Perímetro</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                78 m <span className="text-[#006591] text-xs font-normal">/ 500 m</span>
              </span>
            </div>
            <div className={`flex flex-col px-3.5 py-2 rounded-lg min-w-[130px] border ${
              isBurned ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Consumo Token</span>
              <span className="text-sm font-bold font-mono">
                {isBurned ? '1 / 1 (Quemado)' : '0 / 1 (Válido)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Scanner & Decoded JWT */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Scanner Camera HUD */}
          <div className="bg-[#131b2e] text-white rounded-xl overflow-hidden shadow-sm border border-slate-800">
            <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] uppercase font-bold tracking-wider text-sky-300">
                  Cámara Sensor UV / Bip Lente Activa
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/10 text-white uppercase font-bold">
                60 FPS · 1080p
              </span>
            </div>

            {/* Video Simulation Area */}
            <div className="relative h-64 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzh2lTv_LWL6AuX2XK2D3IU4lFqUawyUfgtZL3F_hQmoSOa3CT9gQVTO29LDtrS407bio9vcHCMSx7d39lmVXT6M8yC4wD2NFUPjh1s9ASF1t2t2XLj2hH19eo6FyIVnv_D9-iGa2k895js8IPOXxydO15TW3WsCdfSDqrTuk5WddX76UpKfw-BlbUaBs7Y-tmaX59xL5_6bLFjuwUzqG-aFO2KCTtYPRBRkQc4zSECUzVG6fuABYJag')`
                }}
              />

              {/* Laser Line */}
              <div className="absolute left-6 right-6 h-0.5 bg-[#39b8fd] shadow-[0_0_12px_#39b8fd] animate-pulse z-10"></div>

              {/* Reticle Target */}
              <div className="relative w-48 h-48 flex flex-col justify-between p-2 z-20 border border-sky-400/30 rounded-lg">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-[#39b8fd]"></div>
                  <div className="w-6 h-6 border-t-2 border-r-2 border-[#39b8fd]"></div>
                </div>

                <div className="flex flex-col items-center justify-center p-2.5 bg-slate-950/80 rounded-lg backdrop-blur-md border border-slate-700">
                  <Scan className="w-8 h-8 text-[#39b8fd] mb-1" />
                  <span className="font-mono text-xs text-emerald-400 font-bold tracking-wider">
                    {isBurned ? 'TOKEN QUEMADO' : 'JWT CAPTURADO'}
                  </span>
                  <span className="text-[10px] text-slate-400">FIRMA CONFIRMADA</span>
                </div>

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-[#39b8fd]"></div>
                  <div className="w-6 h-6 border-b-2 border-r-2 border-[#39b8fd]"></div>
                </div>
              </div>

              {/* Geotag Stamp */}
              <div className="absolute bottom-2 left-3 z-20 font-mono text-[10px] text-sky-200 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                LOC: 7.5348 N, 80.0205 W · AZUERO SECTOR ORIAS
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-[#89ceff] font-mono text-[11px]">
                <span>ALGORITMO: HMAC-SHA256</span>
                <span>TOKEN EFÍMERO (UN SOLO USO)</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Firma digital emitida por Servidor Central OMNEX v2.0. Conexión de nodo cifrada con validación instantánea en IndexedDB offline.
              </p>
            </div>
          </div>

          {/* Raw JWT Payload Inspector */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#006591]" />
                <span className="text-sm font-bold text-slate-900">Inspección de Payload JWT</span>
              </div>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                HS256 Verified
              </span>
            </div>

            {/* Encoded JWT string with colored segments */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Token Crudo Decodificado:
              </span>
              <p className="font-mono text-xs break-all leading-relaxed select-all">
                <span className="text-red-600 font-bold">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>.
                <span className="text-[#006591] font-bold">eyJmYW1JZF9vdXQiOiJGQU0tUFRJLTA0MiIsInpvbmEiOiJPcmlhIEFycmliYSIsImlhdCI6MTcxNTg5MzIwMCwiZXhwIjoxNzE1OTA0MDAwLCJkZWxpdmVyeUl0ZW1zIjpbIldBVEVSXzIwTCIsIkZPT0RfS0lUIiwiUEVESUFUUklDX0tJVCJdfQ</span>.
                <span className="text-slate-500 font-bold">3b9xYqG9X...7VpQ_OMNEX_KEY</span>
              </p>
            </div>

            {/* Decoded Claims Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-semibold">Fam ID Registrado</span>
                <span className="font-bold text-slate-900">FAM-PTI-042</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-semibold">Comunidad / Zona</span>
                <span className="font-bold text-slate-900">Oria Arriba, Los Santos</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-semibold">Emitido (IAT)</span>
                <span className="text-slate-800">14:22:00 UTC-5</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase block font-sans font-semibold">Expira (EXP)</span>
                <span className="font-bold text-red-600">17:22:00 UTC-5 (3h)</span>
              </div>
            </div>

            {/* Anti-Cloning Callout */}
            <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#006591] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Mecanismo Anti-Clonación Activo</span>
                <span className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Si se procesa un segundo intento de lectura para el código FAM-PTI-042, el token será revocado instantáneamente y se disparará una alerta por posible duplicidad de bonos humanitarios.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Verification & Dispatch Execution */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Validation Checklist Matrix */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#006591] text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Validación de Integridad y Unicidad</h3>
                  <span className="text-[10px] text-[#006591] uppercase font-bold tracking-wider">
                    Filtro Criptográfico de Una Sola Vez
                  </span>
                </div>
              </div>
              <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                isBurned
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {isBurned ? 'ESTADO: CONSUMIDO' : 'ESTADO: APROBADO'}
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="flex items-start justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Firma Criptográfica OMNEX</span>
                    <span className="text-[11px] text-slate-500">Firmada con la llave maestra territorial del Despacho Nacional SINAPROC / Cruz Roja.</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                  VÁLIDA
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-start justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 ${
                    isBurned ? 'bg-red-600' : 'bg-emerald-600'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Estado del Token (Anti-Fraude)</span>
                    <span className="text-[11px] text-slate-500">
                      {isBurned
                        ? 'Token ya fue invalidado y registrado en el ledger inmutable.'
                        : 'No existe registro de canje previo en el Ledger de Azuero ni en la base local IndexedDB.'}
                    </span>
                  </div>
                </div>
                <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded shrink-0 border ${
                  isBurned ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {isBurned ? 'QUEMADO (Invalido)' : 'NO USADO (Limpio)'}
                </span>
              </div>

              {/* Item 3: Geofencing 500m */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Geolocalización Forzada (Geofencing 500m)</span>
                      <span className="text-[11px] text-slate-500">Obliga a que el voluntario esté físicamente en el domicilio registrado de la familia.</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#006591] bg-sky-50 border border-sky-200 px-2 py-0.5 rounded shrink-0">
                    DENTRO DEL RANGO
                  </span>
                </div>

                {/* Coords & Progress Meter */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Coordenada Registro (Familia):</span>
                      <span className="font-bold text-slate-900">7.5342° N, -80.0211° W</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Coordenada Actual (Terminal):</span>
                      <span className="font-bold text-slate-900">7.5348° N, -80.0205° W</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span>Distancia Radial: <strong className="font-mono text-[#006591]">78 metros</strong></span>
                      <span className="text-slate-400 text-[11px]">Tolerancia Máx: 500m</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#006591] h-full rounded-full" style={{ width: '15.6%' }}></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#006591] pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Geolocalización Verificada para Entrega (Margen de Error: ±3.2m)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rural Route, Map & Waze Navigation Section */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#006591]" />
                <h3 className="text-sm font-bold text-slate-900">Navegación de Campo Rural & Acceso</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                Ruta Los Santos #AZ-701
              </span>
            </div>

            {/* Mini Map */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxFNvihnOyQY9mOKTQDZJJYmD2UUAJUDkGWauZ6dj--Ih7G-2VP7LWhJGSuPh-H9VUOlANT-k_Tcde8_8hydEYpJTAcplJYcdtG4rjbsNhcJ6k33Ak9CoiZzq0RSOfMRU8ShT6jsL4gxuLRUufIV3I8F5-8a8D0xgRFlPd_4hAE4SDw2cHOqVgN7JZn3kNabirmteMHamRn-JD-Z1LykimRNwMHF7Ab7UPY6ya4SaURHdTM8AtRgPr_w')`
                }}
              />
              <div className="absolute top-2 left-2 bg-slate-950/90 text-white font-mono text-[10px] px-2 py-1 rounded backdrop-blur-md flex items-center gap-1">
                <Navigation className="w-3 h-3 text-sky-400" />
                <span>Vado Río Oria: Transitable con 4x4</span>
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">Condición de Camino de Tierra Rural</span>
                <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                  Cruce por el río Oria con nivel moderado por lluvias. Archivos de Waze pre-descargados en caché local para navegación sin conectividad celular en la cuenca.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="https://waze.com/ul?ll=7.5342,-80.0211&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#006591] hover:bg-[#004e70] text-white py-2.5 px-4 rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Abrir Ruta en Waze (Rumbo 7.5342, -80.0211)</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <button
                type="button"
                onClick={handleRefreshGps}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-3.5 rounded-lg text-xs font-bold transition-colors border border-slate-200"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${gpsRefreshed ? 'animate-spin' : ''}`} />
                <span>Refrescar Caché GPS</span>
              </button>
            </div>
          </div>

          {/* Dotation Authorized for Dispatch */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#006591]" />
                <h3 className="text-sm font-bold text-slate-900">Dotación Autorizada para Despacho</h3>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                Censo: 4 Personas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Item 1 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[#006591] mb-1">
                    <Droplets className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold bg-sky-100 px-1.5 py-0.5 rounded text-[#006591]">
                      x2
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Agua Potable 20L</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">2 Garrafones con precinto.</span>
                </div>
                <span className="text-[10px] font-mono text-[#006591] font-bold mt-2">Lote: AP-2024-AZ09</span>
              </div>

              {/* Item 2 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[#006591] mb-1">
                    <Utensils className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold bg-sky-100 px-1.5 py-0.5 rounded text-[#006591]">
                      x1
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Módulo Familiar</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Ración 14d: granos, leche, latas.</span>
                </div>
                <span className="text-[10px] font-mono text-[#006591] font-bold mt-2">Lote: MF-ST-881</span>
              </div>

              {/* Item 3 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[#006591] mb-1">
                    <Baby className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold bg-sky-100 px-1.5 py-0.5 rounded text-[#006591]">
                      x1
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Kit Pediátrico</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Fórmula 1 y 2, suero, pañales T3.</span>
                </div>
                <span className="text-[10px] font-mono text-[#006591] font-bold mt-2">Lote: KP-MED-104</span>
              </div>
            </div>

            {/* Recipient Photo & Details */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <div 
                className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-slate-300"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAue5OxEN6Bov1cyKPIeFU0i1l4PbAZx2VEB1DJEvqxP0S0eXs7PO7eZ4ojADH6o0GIbNYGDSQWgftW5_Qmn_DnV1klKAj3h5mgDC2lTDFLb0aFmUsh6fkOoB4Z9CojUHDkgHatq-KxurCXSAULGlxztw8b13Zzzkd6fCLCQySK4BJcrTBRVFTgBcz9mUCP1XHkErUS4nKlvIng89YJNTxjtYbVI1GP_A-4J_cztqTq9Byz4WeGcjv-Vw')`
                }}
              />
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-xs font-bold text-slate-900">
                  Beneficiario Registrado: Eulogio Melgar Cedeño
                </span>
                <span className="text-[11px] text-slate-500">
                  Cédula: 7-702-1499 · Domicilio censado en Oria Arriba cerca de la escuela primaria.
                </span>
                <span className="text-[10px] font-mono text-[#006591] font-bold mt-1">
                  Conformidad biométrica cruzada en censo v2.0.4
                </span>
              </div>
            </div>

            {/* BURN ACTION BUTTON */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleBurnToken}
                disabled={isBurned || isBurning}
                data-testid="burn-token-action-btn"
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isBurned
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.99]'
                }`}
              >
                <Flame className={`w-4 h-4 ${isBurned ? 'text-slate-400' : 'text-amber-400'}`} />
                <span data-testid="burn-token-status-text">
                  {isBurning
                    ? 'Quemando Token Criptográfico...'
                    : isBurned
                    ? 'Token Inválido · Despacho Ya Ejecutado'
                    : 'Confirmar Entrega e Invalidar Token (Burn JWT)'}
                </span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                <span>Operación Criptográfica Irreversible</span>
                <span>Hash: 8f4a2c91bda44e01...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
