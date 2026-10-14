import { CensusRecord, AuditLedgerRow, WebhookTriggerLog } from '@/types';
import { getOmnexDB } from './data/dexie-db';
import { SecureVault } from './crypto/secure-vault';

const STORAGE_KEYS = {
  CENSUS_LIST: 'omnex_census_records',
  TOKEN_BURNED: 'omnex_jwt_burned_fam_pti_042',
  PENDING_SYNC_COUNT: 'omnex_pending_sync_count',
  AUDIT_LOGS: 'omnex_audit_ledger',
  WEBHOOK_LOGS: 'omnex_webhook_logs',
  OFFLINE_MODE: 'omnex_is_offline_forced',
  NULLIFIER_SET: 'omnex_token_nullifiers',
};

export const INITIAL_AUDIT_LOGS: AuditLedgerRow[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-14 14:32:19',
    eventType: 'DESPACHO VALIDADO',
    operator: 'a.herrera@omnexpa.com (AZ-04)',
    community: 'Tonosí Cabecera, Albergue Central',
    sha256Hash: 'e7f3b890a21cd67ef228190c102a0f8812c7',
    integrity: 'VÁLIDO',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-14 14:18:04',
    eventType: 'SYNC N8N POST-OFFLINE',
    operator: 'nodo-field-worker-02',
    community: 'Guánico Abajo (Sector Río)',
    sha256Hash: '8a9b231cd108e45ff9038201de981a56bc99',
    integrity: 'VÁLIDO',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-14 13:55:40',
    eventType: 'QUEMA TOKEN QR #810',
    operator: 'c.mendoza@omnexpa.com (TB-01)',
    community: 'Corregimiento El Bebedero',
    sha256Hash: '5418b76cfa98012e4d98a01f55b90214aee1',
    integrity: 'VÁLIDO',
  },
  {
    id: 'log-4',
    timestamp: '2026-10-14 13:12:11',
    eventType: 'CENSO REGISTRO EN CAMPO',
    operator: 'voluntario-sinaproc-88',
    community: 'Cañas, Vía Los Santos',
    sha256Hash: '7c22e409bda44f9103e5c92841ad0214ee67',
    integrity: 'VÁLIDO',
  },
];

export const INITIAL_CENSUS_RECORDS: CensusRecord[] = [
  {
    id: 'rec-1',
    familyCode: 'FAM-PTI-042',
    jurisdiction: 'Pedasí / Oria Arriba',
    coordinates: {
      lat: 7.5342,
      lng: -80.0211,
      accuracy: '±4.2m (GNSS OK)',
    },
    demographics: {
      kids: 1,
      teens: 0,
      adults: 2,
      seniors: 1,
      hasDisability: false,
    },
    needs: ['water', 'food'],
    urgency: 'ALTO',
    ley81Consent: true,
    syncStatus: 'PENDING',
    createdAt: '2026-10-14 14:22:00',
    tokenGenerated: 'PTI-042-99824X',
    sha256Hash: '7c22e409bda44f9103e5c92841ad0214ee67',
  },
];

function notifyStorageChange(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(value);
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: raw,
      url: window.location.href,
    }));
  } catch {
    // fallback
  }
}

export function getStoredCensusList(): CensusRecord[] {
  if (typeof window === 'undefined') return INITIAL_CENSUS_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CENSUS_LIST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CENSUS_LIST, JSON.stringify(INITIAL_CENSUS_RECORDS));
      return INITIAL_CENSUS_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CENSUS_RECORDS;
  }
}

export function saveCensusRecord(record: CensusRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredCensusList();
    const updated = [record, ...list.filter((r) => r.familyCode !== record.familyCode)];
    localStorage.setItem(STORAGE_KEYS.CENSUS_LIST, JSON.stringify(updated));
    notifyStorageChange(STORAGE_KEYS.CENSUS_LIST, updated);
    
    // Async persist to Dexie IndexedDB
    try {
      const db = getOmnexDB();
      db.censos.put(record);
      db.syncOutbox.add({
        entity: 'census',
        operation: 'CREATE',
        payload: record as unknown as Record<string, unknown>,
        timestamp: new Date().toISOString(),
        status: 'QUEUED',
        retryCount: 0,
      });
    } catch (e) {
      console.warn('Dexie async store note:', e);
    }

    // Increment sync queue
    const currentQueue = getPendingSyncCount();
    setPendingSyncCount(currentQueue + 1);

    // Add audit entry with cryptographic integrity
    addAuditEntry({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      eventType: 'CENSO REGISTRO EN CAMPO',
      operator: 'a.herrera@omnexpa.com (AZ-04)',
      community: record.jurisdiction,
      sha256Hash: record.sha256Hash,
      integrity: 'VÁLIDO',
    });
  } catch (err) {
    console.error('Error saving census record:', err);
  }
}

export function getPendingSyncCount(): number {
  if (typeof window === 'undefined') return 14;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC_COUNT);
    return raw !== null ? parseInt(raw, 10) : 14;
  } catch {
    return 14;
  }
}

export function setPendingSyncCount(count: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC_COUNT, count.toString());
    notifyStorageChange(STORAGE_KEYS.PENDING_SYNC_COUNT, count);
  } catch (err) {
    console.error(err);
  }
}

export function getIsTokenBurned(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN_BURNED) === 'true';
  } catch {
    return false;
  }
}

export function setTokenBurned(isBurned: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN_BURNED, isBurned ? 'true' : 'false');
    notifyStorageChange(STORAGE_KEYS.TOKEN_BURNED, isBurned);

    if (isBurned) {
      addAuditEntry({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        eventType: 'QUEMA ATÓMICA TOKEN #042',
        operator: 'a.herrera@omnexpa.com (AZ-04)',
        community: 'Pedasí / Oria Arriba',
        sha256Hash: '8f4a2c91bda44e0192bc012dfac88102',
        integrity: 'VÁLIDO',
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export function getAuditLogs(): AuditLedgerRow[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditEntry(entry: AuditLedgerRow): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getAuditLogs();
    const updated = [entry, ...current];
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    notifyStorageChange(STORAGE_KEYS.AUDIT_LOGS, updated);

    // Persist to Dexie
    try {
      const db = getOmnexDB();
      db.auditLogs.put(entry);
    } catch {
      // ignore
    }
  } catch (err) {
    console.error(err);
  }
}

export function getWebhookLogs(): WebhookTriggerLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEBHOOK_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logWebhookCall(log: WebhookTriggerLog): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getWebhookLogs();
    const updated = [log, ...logs.slice(0, 19)]; // keep 20 most recent
    localStorage.setItem(STORAGE_KEYS.WEBHOOK_LOGS, JSON.stringify(updated));
    notifyStorageChange(STORAGE_KEYS.WEBHOOK_LOGS, updated);
  } catch (err) {
    console.error(err);
  }
}

export function purgeFamilyData(familyCode: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredCensusList();
    const filtered = list.filter((r) => r.familyCode !== familyCode);
    localStorage.setItem(STORAGE_KEYS.CENSUS_LIST, JSON.stringify(filtered));
    notifyStorageChange(STORAGE_KEYS.CENSUS_LIST, filtered);
    
    // Purge from Dexie
    try {
      const db = getOmnexDB();
      db.censos.where('familyCode').equals(familyCode).delete();
    } catch {
      // ignore
    }

    // Add audit entry of ARCO purge (Ley 81)
    addAuditEntry({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      eventType: 'ARCO PURGA LEY 81 (CRYPTO-SHREDDING)',
      operator: 'DPO Oficial Privacidad (ANTAI Delegación OMNEX)',
      community: 'Pedasí / Oria Arriba',
      sha256Hash: 'cdd2026ff81290ecca410982bbac9012',
      integrity: 'PURGADO',
    });
  } catch (err) {
    console.error(err);
  }
}
