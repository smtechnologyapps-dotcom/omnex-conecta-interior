import { BaseEntity, IDataRepository, DataBackendMode } from './types';
import { DexieRepository } from './adapters/dexie.adapter';
import { SupabaseRepository } from './adapters/supabase.adapter';
import { OmnexTacticalDB } from './dexie-db';

export function getRepository<T extends BaseEntity>(
  tableName: keyof OmnexTacticalDB
): IDataRepository<T> {
  const mode: DataBackendMode =
    (process.env.NEXT_PUBLIC_DATA_BACKEND as DataBackendMode) || 'local-dexie';

  switch (mode) {
    case 'supabase-hybrid':
      return new SupabaseRepository<T>(String(tableName));
    case 'local-dexie':
    default:
      return new DexieRepository<T>(String(tableName));
  }
}
