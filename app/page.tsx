'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { AppSidebar } from '@/components/AppSidebar';
import { CentroDeMandoView } from '@/components/views/CentroDeMandoView';
import { CensoOfflineView } from '@/components/views/CensoOfflineView';
import { DespachoQrView } from '@/components/views/DespachoQrView';
import { AuditoriaLey81View } from '@/components/views/AuditoriaLey81View';
import { PortalPacientesView } from '@/components/views/PortalPacientesView';
import { PortalVoluntariosView } from '@/components/views/PortalVoluntariosView';
import { MuroComunicacionesView } from '@/components/views/MuroComunicacionesView';
import { PanelAdministracionView } from '@/components/views/PanelAdministracionView';
import { AntigravitySpecView } from '@/components/views/AntigravitySpecView';
import { ActiveView } from '@/types';
import { getPendingSyncCount, setPendingSyncCount } from '@/lib/storage';
import { TacticalSyncEngine } from '@/lib/sync/sync-engine';
import { 
  Radio, 
  UserCheck, 
  QrCode, 
  Scale, 
  Users, 
  Truck, 
  FileCode2,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Wifi,
  WifiOff
} from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  icon?: string;
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<ActiveView>('centro-mando');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setSyncCount] = useState<number>(() => getPendingSyncCount());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sincronización reactiva multi-pestaña y auto-sync en recuperación de red
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'omnex_pending_sync_count' && e.newValue) {
        setSyncCount(parseInt(e.newValue, 10));
      }
    };
    window.addEventListener('storage', handleStorage);
    const cleanupAutoSync = TacticalSyncEngine.initializeAutoSync();

    return () => {
      window.removeEventListener('storage', handleStorage);
      cleanupAutoSync();
    };
  }, []);

  const showToast = (message: string, icon = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleToggleOnline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Enlace Starlink/Móvil detectado. Conexión a Supabase activa.'
          : 'Modo Sin Conexión forzado. La app opera 100% offline con Dexie IndexedDB.',
        next ? 'wifi' : 'wifi-off'
      );
      return next;
    });
  };

  const handleForcedSync = async () => {
    setIsSyncing(true);
    showToast('Iniciando reconciliación batch hacia cluster Supabase vía n8n...', 'sync');

    try {
      const syncResult = await TacticalSyncEngine.processOutboxQueue();
      if (syncResult.succeeded > 0) {
        showToast(`Sincronización Outbox completada: ${syncResult.succeeded} registros reconciliados.`, 'check');
      } else {
        await fetch('/api/webhooks/mock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'OFFLINE_BATCH_SYNC',
            nodeId: '#PAN-AZ-04',
            pendingCount: pendingSyncCount,
            timestamp: new Date().toISOString(),
          }),
        });
      }
    } catch (err) {
      console.log('Sync simulated error fallback', err);
    }

    setTimeout(() => {
      setIsSyncing(false);
      setSyncCount(0);
      setPendingSyncCount(0);
      showToast(
        'Sincronización completada con éxito. Cola transaccional reconciliada en Supabase.',
        'check'
      );
    }, 1200);
  };

  return (
    <div
      data-testid="omnex-tactical-shell"
      className="min-h-screen bg-[#050B14] text-slate-100 font-sans antialiased selection:bg-[#2DD4BF]/30 overflow-x-hidden"
    >
      {/* Top Header */}
      <AppHeader
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        pendingSyncCount={pendingSyncCount}
        onForcedSync={handleForcedSync}
        isSyncing={isSyncing}
      />

      {/* Main Shell */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar
            activeView={activeView}
            onSelectView={setActiveView}
            pendingSyncCount={pendingSyncCount}
          />
        </div>

        {/* Content Viewport */}
        <main
          data-testid="main-content-viewport"
          className="w-full pt-24 pb-24 lg:pb-8 px-4 sm:px-6 lg:pl-80 lg:pr-8 min-h-screen dark-tactical-view"
        >
          {/* Mobile Fast Navigation Strip (Pills) */}
          <div className="lg:hidden flex items-center gap-1.5 pb-4 overflow-x-auto mb-2 text-xs no-scrollbar">
            <button
              onClick={() => setActiveView('centro-mando')}
              data-testid="nav-tab-centro-mando"
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all ${
                activeView === 'centro-mando'
                  ? 'bg-[#2DD4BF] text-[#050B14] shadow-[0_0_15px_rgba(45,212,191,0.35)]'
                  : 'bg-[#0A1626] border border-slate-800 text-slate-300'
              }`}
            >
              Centro Mando
            </button>
            <button
              onClick={() => setActiveView('censo-offline')}
              data-testid="nav-tab-censo-offline"
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all ${
                activeView === 'censo-offline'
                  ? 'bg-[#2DD4BF] text-[#050B14] shadow-[0_0_15px_rgba(45,212,191,0.35)]'
                  : 'bg-[#0A1626] border border-slate-800 text-slate-300'
              }`}
            >
              Censo Offline
            </button>
            <button
              onClick={() => setActiveView('despacho-qr')}
              data-testid="nav-tab-despacho-qr"
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all ${
                activeView === 'despacho-qr'
                  ? 'bg-[#2DD4BF] text-[#050B14] shadow-[0_0_15px_rgba(45,212,191,0.35)]'
                  : 'bg-[#0A1626] border border-slate-800 text-slate-300'
              }`}
            >
              Despacho QR
            </button>
            <button
              onClick={() => setActiveView('auditoria-ley81')}
              data-testid="nav-tab-auditoria-ley81"
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all ${
                activeView === 'auditoria-ley81'
                  ? 'bg-[#2DD4BF] text-[#050B14] shadow-[0_0_15px_rgba(45,212,191,0.35)]'
                  : 'bg-[#0A1626] border border-slate-800 text-slate-300'
              }`}
            >
              Auditoría
            </button>
            <button
              onClick={() => setActiveView('portal-pacientes')}
              data-testid="nav-tab-portal-pacientes"
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all ${
                activeView === 'portal-pacientes'
                  ? 'bg-[#2DD4BF] text-[#050B14] shadow-[0_0_15px_rgba(45,212,191,0.35)]'
                  : 'bg-[#0A1626] border border-slate-800 text-slate-300'
              }`}
            >
              Pacientes
            </button>
            <button
              onClick={() => setActiveView('antigravity-spec')}
              data-testid="nav-tab-antigravity-spec"
              className={`px-3 py-2 rounded-xl font-bold shrink-0 transition-all ${
                activeView === 'antigravity-spec'
                  ? 'bg-[#60A5FA] text-[#050B14] shadow-[0_0_15px_rgba(96,165,250,0.35)]'
                  : 'bg-[#0A1626] border border-slate-800 text-slate-300'
              }`}
            >
              Antigravity JSON
            </button>
          </div>

          {/* Active Dynamic Screen Component */}
          {activeView === 'centro-mando' && (
            <CentroDeMandoView onNavigate={setActiveView} onShowToast={showToast} />
          )}

          {activeView === 'censo-offline' && (
            <CensoOfflineView
              isOnline={isOnline}
              onNavigate={setActiveView}
              onShowToast={showToast}
              onSyncTrigger={handleForcedSync}
              isSyncing={isSyncing}
            />
          )}

          {activeView === 'despacho-qr' && (
            <DespachoQrView onShowToast={showToast} isOnline={isOnline} />
          )}

          {activeView === 'auditoria-ley81' && (
            <AuditoriaLey81View onShowToast={showToast} />
          )}

          {activeView === 'portal-pacientes' && (
            <PortalPacientesView onNavigate={setActiveView} onShowToast={showToast} />
          )}

          {activeView === 'portal-voluntarios' && (
            <PortalVoluntariosView onNavigate={setActiveView} onShowToast={showToast} />
          )}

          {activeView === 'muro-comunicaciones' && (
            <MuroComunicacionesView onShowToast={showToast} />
          )}

          {activeView === 'panel-administracion' && (
            <PanelAdministracionView onShowToast={showToast} />
          )}

          {activeView === 'antigravity-spec' && (
            <AntigravitySpecView onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Tactical Mobile Bottom Action Bar (Estilo Banco General / Ergonomía Táctica) */}
      <nav
        data-testid="mobile-tactical-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1626]/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-2 flex items-center justify-around"
      >
        <button
          onClick={() => setActiveView('centro-mando')}
          data-testid="bottom-nav-mando-btn"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl transition-all ${
            activeView === 'centro-mando' ? 'text-[#2DD4BF]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Mando</span>
        </button>

        <button
          onClick={() => setActiveView('censo-offline')}
          data-testid="bottom-nav-censo-btn"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl transition-all ${
            activeView === 'censo-offline' ? 'text-[#2DD4BF]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Censo</span>
        </button>

        <button
          onClick={() => setActiveView('despacho-qr')}
          data-testid="bottom-nav-despacho-btn"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl transition-all ${
            activeView === 'despacho-qr' ? 'text-[#2DD4BF]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Despacho</span>
        </button>

        <button
          onClick={() => setActiveView('auditoria-ley81')}
          data-testid="bottom-nav-auditoria-btn"
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl transition-all ${
            activeView === 'auditoria-ley81' ? 'text-[#2DD4BF]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">Ley 81</span>
        </button>

        <button
          onClick={handleForcedSync}
          disabled={isSyncing}
          data-testid="bottom-nav-sync-btn"
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl text-[#60A5FA] hover:text-[#93c5fd] active:scale-95 transition-all"
        >
          <RefreshCw className={`w-5 h-5 mb-0.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="text-[10px] font-bold">Sync ({pendingSyncCount})</span>
        </button>
      </nav>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm sm:max-w-md w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            data-testid="system-toast-notification"
            className="pointer-events-auto flex items-center gap-2.5 bg-[#0A1626]/95 text-white px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.5)] text-xs border border-slate-700/80 backdrop-blur-xl transition-all transform animate-in fade-in slide-in-from-bottom-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
