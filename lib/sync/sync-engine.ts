/**
 * OMNEX TACTICAL SYNC ENGINE (Outbox Pattern & Offline Reconciliation)
 * Resiliencia en Redes 2G/3G/Rurales y Zonas Cero Conectividad en Panamá
 * OMNEX Conecta Interior - Sistema Táctico
 */

import { getOmnexDB, SyncOutboxOperation } from '../data/dexie-db';
import { getPendingSyncCount, setPendingSyncCount, addAuditEntry } from '../storage';

export interface SyncResult {
  processed: number;
  succeeded: number;
  failed: number;
  errors: string[];
}

export class TacticalSyncEngine {
  private static isSyncing = false;

  /**
   * Procesa la cola Outbox transaccional de Dexie hacia los endpoints remotos / n8n
   */
  public static async processOutboxQueue(): Promise<SyncResult> {
    if (this.isSyncing) {
      return { processed: 0, succeeded: 0, failed: 0, errors: ['Sincronización ya en curso'] };
    }

    if (typeof window === 'undefined' || !navigator.onLine) {
      return { processed: 0, succeeded: 0, failed: 0, errors: ['Sin conectividad de red'] };
    }

    this.isSyncing = true;
    const db = getOmnexDB();
    const result: SyncResult = { processed: 0, succeeded: 0, failed: 0, errors: [] };

    try {
      const queuedOperations = await db.syncOutbox
        .where('status')
        .anyOf(['QUEUED', 'FAILED'])
        .toArray();

      result.processed = queuedOperations.length;

      for (const op of queuedOperations) {
        if (!op.id) continue;

        try {
          await db.syncOutbox.update(op.id, { status: 'IN_FLIGHT' });

          const response = await fetch('/api/webhooks/mock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: `OUTBOX_${op.entity.toUpperCase()}_${op.operation}`,
              nodeId: '#PAN-AZ-04',
              payload: op.payload,
              timestamp: op.timestamp,
            }),
          });

          if (response.ok) {
            await db.syncOutbox.update(op.id, { status: 'RESOLVED' });
            result.succeeded++;
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          result.failed++;
          result.errors.push(`Op ${op.id} fallo: ${errorMsg}`);
          await db.syncOutbox.update(op.id, {
            status: 'FAILED',
            retryCount: (op.retryCount || 0) + 1,
          });
        }
      }

      // Actualizar contador visual de pendientes
      const remainingCount = await db.syncOutbox
        .where('status')
        .anyOf(['QUEUED', 'FAILED', 'IN_FLIGHT'])
        .count();

      setPendingSyncCount(remainingCount);

      if (result.succeeded > 0) {
        addAuditEntry({
          id: `sync-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          eventType: 'SYNC OUTBOX PROCESADO',
          operator: 'sistema-offline-sync-engine',
          community: 'Azuero Nodo Central',
          sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
          integrity: 'VÁLIDO',
        });
      }
    } catch (globalErr: unknown) {
      const msg = globalErr instanceof Error ? globalErr.message : String(globalErr);
      result.errors.push(`Error crítico en motor de sincronización: ${msg}`);
    } finally {
      this.isSyncing = false;
    }

    return result;
  }

  /**
   * Inicializa los observadores de conectividad para auto-sincronización
   */
  public static initializeAutoSync(): () => void {
    if (typeof window === 'undefined') return () => {};

    const handleOnline = () => {
      console.log('[OMNEX SYNC] Conectividad recuperada. Iniciando drenaje de Outbox...');
      this.processOutboxQueue().catch(console.error);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }
}
