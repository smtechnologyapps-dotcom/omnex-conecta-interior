export type ActiveView =
  | 'centro-mando'
  | 'censo-offline'
  | 'despacho-qr'
  | 'auditoria-ley81'
  | 'portal-pacientes'
  | 'portal-voluntarios'
  | 'muro-comunicaciones'
  | 'panel-administracion'
  | 'antigravity-spec';

export interface DemographicCounts {
  kids: number;
  teens: number;
  adults: number;
  seniors: number;
  hasDisability: boolean;
}

export type UrgencyLevel = 'CRITICO' | 'ALTO' | 'MODERADO';

export type PriorityNeed = 'water' | 'food' | 'hygiene' | 'roof' | 'meds' | 'power';

export interface CensusRecord {
  id: string;
  familyCode: string;
  jurisdiction: string;
  coordinates: {
    lat: number;
    lng: number;
    accuracy: string;
  };
  demographics: DemographicCounts;
  needs: PriorityNeed[];
  urgency: UrgencyLevel;
  ley81Consent: boolean;
  syncStatus: 'PENDING' | 'SYNCED' | 'CONFLICT';
  createdAt: string;
  tokenGenerated: string;
  sha256Hash: string;
}

export interface AuditLedgerRow {
  id: string;
  timestamp: string;
  eventType: string;
  operator: string;
  community: string;
  sha256Hash: string;
  integrity: 'VÁLIDO' | 'REVOCADO' | 'PURGADO';
}

export interface WebhookTriggerLog {
  id: string;
  webhookId: string;
  name: string;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR' | 'QUEUED_OFFLINE';
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
}
