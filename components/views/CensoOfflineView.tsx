'use client';

import React, { useState } from 'react';
import { 
  CloudOff, 
  RefreshCw, 
  MapPin, 
  Users, 
  Baby, 
  GraduationCap, 
  User, 
  HeartHandshake, 
  Accessibility, 
  Droplets, 
  Package, 
  Sparkles, 
  Home, 
  Pill, 
  Sun, 
  ShieldCheck, 
  Save, 
  QrCode, 
  Compass, 
  Tablet, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { PriorityNeed, UrgencyLevel, CensusRecord, ActiveView } from '@/types';
import { saveCensusRecord } from '@/lib/storage';
import { SecureVault } from '@/lib/crypto/secure-vault';

interface CensoOfflineViewProps {
  isOnline: boolean;
  onNavigate: (view: ActiveView) => void;
  onShowToast: (message: string, icon?: string) => void;
  onSyncTrigger: () => void;
  isSyncing: boolean;
}

export const CensoOfflineView: React.FC<CensoOfflineViewProps> = ({
  isOnline,
  onNavigate,
  onShowToast,
  onSyncTrigger,
  isSyncing,
}) => {
  // Household counts
  const [kids, setKids] = useState(1);
  const [teens, setTeens] = useState(0);
  const [adults, setAdults] = useState(2);
  const [seniors, setSeniors] = useState(1);
  const [hasDisability, setHasDisability] = useState(false);

  // Needs & Urgency
  const [needs, setNeeds] = useState<PriorityNeed[]>(['water', 'food']);
  const [urgency, setUrgency] = useState<UrgencyLevel>('ALTO');
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Generated token
  const [generatedCode, setGeneratedCode] = useState('FAM-PTI-042');
  const [tokenGenerated, setTokenGenerated] = useState('PTI-042-99824X');
  const [isSaved, setIsSaved] = useState(false);

  const totalHabitants = kids + teens + adults + seniors;

  const toggleNeed = (need: PriorityNeed) => {
    if (needs.includes(need)) {
      setNeeds(needs.filter((n) => n !== need));
    } else {
      if (needs.length >= 3) {
        onShowToast('Máximo 3 necesidades prioritarias autorizadas por protocolo', 'alert');
        return;
      }
      setNeeds([...needs, need]);
    }
  };

  const handleSaveCensus = async () => {
    if (!consentAccepted) {
      onShowToast('Es mandatorio confirmar el consentimiento de Ley 81', 'alert');
      return;
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const hash = await SecureVault.calculateSha256(
      `CENSO:${generatedCode}:${timestamp}:${kids}:${teens}:${adults}:${seniors}:${needs.join(',')}`
    );

    const newRecord: CensusRecord = {
      id: `census-${Date.now()}`,
      familyCode: generatedCode,
      jurisdiction: 'Pedasí / Oria Arriba',
      coordinates: {
        lat: 7.5342,
        lng: -80.0211,
        accuracy: '±4.2m (GNSS OK)',
      },
      demographics: {
        kids,
        teens,
        adults,
        seniors,
        hasDisability,
      },
      needs,
      urgency,
      ley81Consent: true,
      syncStatus: isOnline ? 'SYNCED' : 'PENDING',
      createdAt: timestamp,
      tokenGenerated,
      sha256Hash: hash,
    };

    saveCensusRecord(newRecord);
    setIsSaved(true);
    onShowToast(`Ficha ${generatedCode} guardada en IndexedDB local con hash criptográfico ${hash.substring(0, 12)}...`, 'save');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Offline Alert Bar */}
      <div className="w-full bg-[#131b2e] text-white rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <CloudOff className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-400 text-slate-950">
                {isOnline ? 'En Línea (Starlink Conectado)' : 'Modo Sin Conexión Activo'}
              </span>
              <span className="text-xs font-mono text-slate-300">AES-256 GCM</span>
              <span className="text-xs font-mono text-slate-400">· IndexedDB Local</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isOnline
                ? 'Conectado a cluster Supabase. Fichas se sincronizan de inmediato.'
                : '14 registros en cola para transmisión segura hacia Supabase vía webhook n8n cuando se detecte enlace.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Buffer Local</span>
            <span className="text-xs font-mono text-[#89ceff]">88.4 KB / 50 MB</span>
          </div>
          <button
            onClick={onSyncTrigger}
            disabled={isSyncing}
            className="px-4 py-2 rounded-lg bg-[#39b8fd] hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Forzar Sincronización</span>
          </button>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intake Inputs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Card 1: Context & GNSS Coordinates */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#006591]">
                  Ficha de Censo de Emergencia #042
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {generatedCode}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    Generado por Nodo
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <MapPin className="w-4 h-4 text-[#006591]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Jurisdicción Territorial</span>
                  <span className="text-xs font-bold font-mono text-slate-800">Pedasí / Oria Arriba</span>
                </div>
              </div>
            </div>

            {/* GNSS Telemetry */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#006591]" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Latitud GPS</span>
                  <span className="text-xs font-mono font-bold text-slate-900">7.534200° N</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-[#006591]" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Longitud GPS</span>
                  <span className="text-xs font-mono font-bold text-slate-900">80.021100° W</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Precisión Satelital</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">±4.2m (GNSS OK)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Household Composition Steppers */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#006591]">
                  Métrica Estricta
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Composición del Núcleo Familiar
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Users className="w-4 h-4 text-[#006591]" />
                <span className="text-xs font-mono font-bold text-slate-800">
                  Total: {totalHabitants} Habitantes
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stepper: Kids */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-[#006591]">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Niñas y Niños</span>
                    <span className="text-xs text-slate-500">0 - 12 años</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setKids(Math.max(0, kids - 1))}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-mono font-extrabold text-base text-slate-900">
                    {kids}
                  </span>
                  <button
                    type="button"
                    onClick={() => setKids(kids + 1)}
                    className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-lg flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stepper: Teens */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-[#006591]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Adolescentes</span>
                    <span className="text-xs text-slate-500">13 - 17 años</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTeens(Math.max(0, teens - 1))}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-mono font-extrabold text-base text-slate-900">
                    {teens}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTeens(teens + 1)}
                    className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-lg flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stepper: Adults */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-[#006591]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Adultos</span>
                    <span className="text-xs text-slate-500">18 - 59 años</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(0, adults - 1))}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-mono font-extrabold text-base text-slate-900">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-lg flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stepper: Seniors */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-[#006591]">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Adultos Mayores</span>
                    <span className="text-xs text-slate-500">60+ años</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSeniors(Math.max(0, seniors - 1))}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-mono font-extrabold text-base text-slate-900">
                    {seniors}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSeniors(seniors + 1)}
                    className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-lg flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Special Priority Toggle: Disability */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                  <Accessibility className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Persona con Discapacidad / Movilidad Reducida</span>
                    {hasDisability && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase">
                        Riesgo Alto
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    Dispara protocolo logístico de entrega priorizada directa a domicilio.
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-slate-200 p-1 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setHasDisability(false)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
                    !hasDisability ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setHasDisability(true)}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${
                    hasDisability ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sí (Prioritaria)
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Priority Supply Needs & Urgency Index */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#006591]">
                Distribución Inmediata
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Necesidades Prioritarias Verificadas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Selección táctica de insumos autorizados (máximo 3).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => toggleNeed('water')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  needs.includes('water')
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Droplets className={`w-5 h-5 ${needs.includes('water') ? 'text-sky-400' : 'text-slate-600'}`} />
                  <div>
                    <span className="text-xs font-bold block">Agua Potable</span>
                    <span className={`text-[11px] ${needs.includes('water') ? 'text-slate-300' : 'text-slate-500'}`}>
                      Bidón 20L + Filtro
                    </span>
                  </div>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${needs.includes('water') ? 'text-sky-400' : 'text-slate-300'}`} />
              </button>

              <button
                type="button"
                onClick={() => toggleNeed('food')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  needs.includes('food')
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className={`w-5 h-5 ${needs.includes('food') ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <div>
                    <span className="text-xs font-bold block">Alimentos No Perec.</span>
                    <span className={`text-[11px] ${needs.includes('food') ? 'text-slate-300' : 'text-slate-500'}`}>
                      Ración Familiar 7D
                    </span>
                  </div>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${needs.includes('food') ? 'text-emerald-400' : 'text-slate-300'}`} />
              </button>

              <button
                type="button"
                onClick={() => toggleNeed('hygiene')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  needs.includes('hygiene')
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-5 h-5 ${needs.includes('hygiene') ? 'text-sky-400' : 'text-slate-600'}`} />
                  <div>
                    <span className="text-xs font-bold block">Kit de Higiene</span>
                    <span className={`text-[11px] ${needs.includes('hygiene') ? 'text-slate-300' : 'text-slate-500'}`}>
                      Femenino y Niños
                    </span>
                  </div>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${needs.includes('hygiene') ? 'text-sky-400' : 'text-slate-300'}`} />
              </button>

              <button
                type="button"
                onClick={() => toggleNeed('roof')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  needs.includes('roof')
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className={`w-5 h-5 ${needs.includes('roof') ? 'text-amber-400' : 'text-slate-600'}`} />
                  <div>
                    <span className="text-xs font-bold block">Láminas de Techo</span>
                    <span className={`text-[11px] ${needs.includes('roof') ? 'text-slate-300' : 'text-slate-500'}`}>
                      Zinc + Tornillería
                    </span>
                  </div>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${needs.includes('roof') ? 'text-amber-400' : 'text-slate-300'}`} />
              </button>

              <button
                type="button"
                onClick={() => toggleNeed('meds')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  needs.includes('meds')
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Pill className={`w-5 h-5 ${needs.includes('meds') ? 'text-rose-400' : 'text-slate-600'}`} />
                  <div>
                    <span className="text-xs font-bold block">Medicamentos</span>
                    <span className={`text-[11px] ${needs.includes('meds') ? 'text-slate-300' : 'text-slate-500'}`}>
                      Oral / Suero / Analg.
                    </span>
                  </div>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${needs.includes('meds') ? 'text-rose-400' : 'text-slate-300'}`} />
              </button>

              <button
                type="button"
                onClick={() => toggleNeed('power')}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                  needs.includes('power')
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sun className={`w-5 h-5 ${needs.includes('power') ? 'text-yellow-400' : 'text-slate-600'}`} />
                  <div>
                    <span className="text-xs font-bold block">Lámpara Solar</span>
                    <span className={`text-[11px] ${needs.includes('power') ? 'text-slate-300' : 'text-slate-500'}`}>
                      Recargable 4000mAh
                    </span>
                  </div>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${needs.includes('power') ? 'text-yellow-400' : 'text-slate-300'}`} />
              </button>
            </div>

            {/* Urgency Selector */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                Nivel de Urgencia Operacional:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('CRITICO')}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    urgency === 'CRITICO'
                      ? 'bg-red-600 text-white border-red-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                  <span>CRÍTICO (&lt;24 hrs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('ALTO')}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    urgency === 'ALTO'
                      ? 'bg-[#006591] text-white border-[#004e70] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-300"></span>
                  <span>ALTO (&lt;72 hrs)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('MODERADO')}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    urgency === 'MODERADO'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
                  <span>MODERADO (7 Días)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Informed Consent & Primary Submit */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#006591]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cumplimiento Estricto Ley 81 de 2019</h3>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Protección de Datos Personales · República de Panamá</span>
              </div>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#006591] focus:ring-sky-500 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">
                  Consentimiento Informado Tácito y Verificado
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  El titular autoriza el tratamiento temporal de datos exclusivamente para fines de socorro humanitario. Cero exposición pública de datos biométricos ni cédulas sin requerimiento judicial.
                </p>
              </div>
            </label>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleSaveCensus}
                data-testid="census-save-btn"
                className="flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
              >
                <Save className="w-4 h-4 text-sky-400" />
                <span>Guardar en IndexedDB & Generar Token Cifrado QR</span>
              </button>

              {isSaved && (
                <button
                  type="button"
                  onClick={() => onNavigate('despacho-qr')}
                  className="py-3.5 px-5 rounded-xl bg-[#006591] hover:bg-[#004e70] text-white text-xs uppercase font-extrabold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Ir a Despacho</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Verification & QR Preview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card: Token QR Payload Preview */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center gap-4">
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#006591]">
                Credencial Temporal
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[10px] font-bold">
                JWT-RS256
              </span>
            </div>

            {/* High Density QR Matrix Representation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center">
              <div className="w-52 h-52 bg-white p-3 rounded-lg border border-slate-300 flex items-center justify-center shadow-inner">
                <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 160 160">
                  <rect x="0" y="0" width="48" height="48" />
                  <rect x="8" y="8" width="32" height="32" fill="#fff" />
                  <rect x="16" y="16" width="16" height="16" />
                  <rect x="112" y="0" width="48" height="48" />
                  <rect x="120" y="8" width="32" height="32" fill="#fff" />
                  <rect x="128" y="16" width="16" height="16" />
                  <rect x="0" y="112" width="48" height="48" />
                  <rect x="8" y="120" width="32" height="32" fill="#fff" />
                  <rect x="16" y="128" width="16" height="16" />
                  <rect x="56" y="8" width="8" height="8" />
                  <rect x="72" y="8" width="16" height="8" />
                  <rect x="96" y="8" width="8" height="8" />
                  <rect x="56" y="24" width="24" height="8" />
                  <rect x="88" y="24" width="8" height="16" />
                  <rect x="64" y="40" width="16" height="8" />
                  <rect x="8" y="56" width="8" height="16" />
                  <rect x="24" y="56" width="16" height="8" />
                  <rect x="48" y="56" width="16" height="16" />
                  <rect x="72" y="56" width="24" height="8" />
                  <rect x="104" y="56" width="16" height="8" />
                  <rect x="128" y="56" width="8" height="24" />
                  <rect x="144" y="56" width="8" height="8" />
                  <rect x="24" y="80" width="8" height="16" />
                  <rect x="40" y="80" width="16" height="8" />
                  <rect x="64" y="72" width="8" height="24" />
                  <rect x="80" y="80" width="24" height="8" />
                  <rect x="112" y="80" width="16" height="16" />
                  <rect x="144" y="80" width="8" height="8" />
                  <rect x="56" y="104" width="16" height="8" />
                  <rect x="80" y="96" width="8" height="16" />
                  <rect x="96" y="104" width="8" height="24" />
                  <rect x="120" y="104" width="16" height="8" />
                  <rect x="144" y="104" width="8" height="16" />
                  <rect x="56" y="120" width="24" height="8" />
                  <rect x="64" y="136" width="16" height="8" />
                  <rect x="80" y="128" width="16" height="8" />
                  <rect x="112" y="128" width="8" height="16" />
                  <rect x="128" y="120" width="24" height="8" />
                  <rect x="136" y="136" width="16" height="16" />
                </svg>
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 mt-2 tracking-widest">
                {tokenGenerated}
              </span>
              <span className="text-[11px] text-slate-500">Válido 14 días offline sin renovación</span>
            </div>

            <div className="w-full flex items-center justify-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 py-2 px-3 rounded-lg font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Firma Digital ECC-P256 Válida</span>
            </div>
          </div>

          {/* Field Tablet Hardware Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="relative h-36 w-full">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUU8xudEzdr5heWTJxVR65XJPU_pf6o4DIRyO-s4_kCyeIaEXdbO1S8eQUfHrNHtl63rHY0okynVH-0P702G_xGD-g9ltaGG-5NVUldaeUNB3HfUHmQUmLc_TnR1orperCeCFqJV_N3ZJ0XVqHeUoGqk-5fGw_8_nj2xWe4zbEnkFul4FV-I3slTvcGkp9m6V7KZiPYxI5O76drnaS51FYh36t2uSA-pJOHssWIbKBKrR1TCthK7PJYQ"
                alt="Panamanian emergency response operative conducting field survey"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Protocolo OMNEX
                </span>
                <p className="text-xs text-slate-200 leading-tight mt-0.5">
                  Captura expedita en terreno rural sin dependencia de red celular.
                </p>
              </div>
            </div>

            <div className="p-3.5 flex flex-col gap-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-500">
                <span>Dispositivo:</span>
                <span className="text-slate-900 font-semibold">Galaxy Tab Active4 Pro</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Batería Operativa:</span>
                <span className="text-emerald-700 font-bold">84% (Ahorro Extremo)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Almacenamiento:</span>
                <span className="text-slate-900 font-semibold">42.1 GB Disponible</span>
              </div>
            </div>
          </div>

          {/* Area Telemetry Anchor */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#006591]">
                Área de Cobertura Pedasí
              </span>
              <span className="font-mono text-xs text-slate-400">PAN-AZ-80</span>
            </div>
            <div 
              className="w-full h-32 rounded-lg bg-cover bg-center relative overflow-hidden border border-slate-200"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUUIHHSg98w54RxlZHruEEeYSmsrIVNwKV2MIn-5S3VmENkiJdcerItVo82EmckCiIGEyazoGrrRHmJUrQ2E1OmwMRtgDWccY3u2Qzg5FxXlXDhSVEODwsi_kqAtLK8uOOhEJUTp6gmnTnHFkp6T78vEhzej73vqh_6hsHlyIAge2H1qF6bWAvZa--Y6Pr6qrPrz9IeJEbP0YKkggVOER6ak9vVTV3W53u3tdOtHCkGzzJQOi-g6r87g')`
              }}
            >
              <div className="absolute top-2 left-2 bg-slate-950/90 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                Sector 4: Oria Arriba
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-5 h-5 rounded-full bg-red-600/40 animate-ping absolute"></div>
                <MapPin className="w-6 h-6 text-red-600 drop-shadow" />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Último Ping GNSS:</span>
              <span className="font-mono font-bold text-slate-800">Hace 12 seg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
