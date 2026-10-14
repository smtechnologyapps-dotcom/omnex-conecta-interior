import { BaseEntity, IDataRepository, QueryFilter, ChangeEvent } from '../types';
import { getOmnexDB, OmnexTacticalDB } from '../dexie-db';

import { Table } from 'dexie';

export class DexieRepository<T extends BaseEntity> implements IDataRepository<T> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getTable(): Table<T, string> {
    const db = getOmnexDB();
    return db.table<T, string>(this.tableName);
  }

  async findAll(filter?: QueryFilter): Promise<T[]> {
    if (typeof window === 'undefined') return [];
    const table = this.getTable();
    let collection = table.toCollection();

    if (filter?.orderBy) {
      collection = filter.orderDirection === 'desc'
        ? table.orderBy(filter.orderBy).reverse()
        : table.orderBy(filter.orderBy);
    }

    if (filter?.offset) {
      collection = collection.offset(filter.offset);
    }

    if (filter?.limit) {
      collection = collection.limit(filter.limit);
    }

    return (await collection.toArray()) as T[];
  }

  async findById(id: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    const table = this.getTable();
    const result = await table.get(id);
    return (result as T) || null;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const table = this.getTable();
    const now = new Date().toISOString();
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      _syncStatus: 'PENDING',
      _version: 1,
    } as unknown as T;

    if (typeof window !== 'undefined') {
      await table.put(newRecord);
      
      // Encolar en Outbox de Dexie
      const db = getOmnexDB();
      await db.syncOutbox.add({
        entity: 'census',
        operation: 'CREATE',
        payload: newRecord as unknown as Record<string, unknown>,
        timestamp: now,
        status: 'QUEUED',
        retryCount: 0,
      });
    }

    return newRecord;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const table = this.getTable();
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Registro con id ${id} no encontrado`);
    }

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      _syncStatus: 'PENDING',
      _version: (existing._version || 1) + 1,
    } as T;

    if (typeof window !== 'undefined') {
      await table.put(updated);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const table = this.getTable();
    await table.delete(id);
  }

  async count(): Promise<number> {
    if (typeof window === 'undefined') return 0;
    const table = this.getTable();
    return await table.count();
  }

  subscribe(callback: (changes: ChangeEvent<T>[]) => void): () => void {
    // Escucha eventos nativos de almacenamiento o hook de sincronización
    if (typeof window === 'undefined') return () => {};

    const handler = (e: StorageEvent) => {
      if (e.key === 'omnex_db_change') {
        try {
          const payload = JSON.parse(e.newValue || '[]');
          callback(payload);
        } catch {
          // ignore parsing error
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}
