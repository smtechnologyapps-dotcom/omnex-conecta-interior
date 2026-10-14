import Dexie, { type Table } from 'dexie';
import { CensusRecord, AuditLedgerRow } from '@/types';

export interface TokenNullifierRecord {
  nullifier: string;
  tokenId: string;
  beneficiaryId: string;
  timestamp: string;
  burnedBy: string;
}

export interface SyncOutboxOperation {
  id?: number;
  entity: 'census' | 'token_burn' | 'audit_log';
  operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'BURN';
  payload: Record<string, unknown>;
  timestamp: string;
  status: 'QUEUED' | 'IN_FLIGHT' | 'FAILED' | 'RESOLVED';
  retryCount: number;
}

export class OmnexTacticalDB extends Dexie {
  censos!: Table<CensusRecord, string>;
  auditLogs!: Table<AuditLedgerRow, string>;
  nullifiers!: Table<TokenNullifierRecord, string>;
  syncOutbox!: Table<SyncOutboxOperation, number>;

  constructor() {
    super('OmnexTacticalInteriorDB');

    this.version(1).stores({
      censos: 'id, familyCode, jurisdiction, syncStatus, urgency, createdAt',
      auditLogs: 'id, timestamp, eventType, integrity, sha256Hash',
      nullifiers: 'nullifier, tokenId, beneficiaryId, timestamp',
      syncOutbox: '++id, entity, operation, status, timestamp',
    });
  }
}

// Singleton de base de datos Dexie con inicialización lazy segura para SSR
let dbInstance: OmnexTacticalDB | null = null;

export function getOmnexDB(): OmnexTacticalDB {
  if (typeof window === 'undefined') {
    // Retornar instancia dummy o lazy para build/SSR
    if (!dbInstance) {
      dbInstance = new OmnexTacticalDB();
    }
    return dbInstance;
  }

  if (!dbInstance) {
    dbInstance = new OmnexTacticalDB();
  }
  return dbInstance;
}
