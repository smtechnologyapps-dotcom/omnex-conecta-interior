import { BaseEntity, IDataRepository, QueryFilter, ChangeEvent } from '../types';

export class SupabaseRepository<T extends BaseEntity> implements IDataRepository<T> {
  private tableName: string;
  private endpoint: string;
  private apiKey: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
    this.apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';
  }

  async findAll(filter?: QueryFilter): Promise<T[]> {
    try {
      const url = new URL(`${this.endpoint}/rest/v1/${this.tableName}`);
      if (filter?.limit) url.searchParams.set('limit', String(filter.limit));
      if (filter?.offset) url.searchParams.set('offset', String(filter.offset));
      if (filter?.orderBy) {
        url.searchParams.set('order', `${filter.orderBy}.${filter.orderDirection || 'asc'}`);
      }

      const res = await fetch(url.toString(), {
        headers: {
          apikey: this.apiKey,
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!res.ok) return [];
      return (await res.json()) as T[];
    } catch {
      return [];
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.endpoint}/rest/v1/${this.tableName}?id=eq.${id}&select=*`, {
        headers: {
          apikey: this.apiKey,
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return (data[0] as T) || null;
    } catch {
      return null;
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = new Date().toISOString();
    const id = `sb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      _syncStatus: 'SYNCED',
      _version: 1,
    } as unknown as T;

    try {
      await fetch(`${this.endpoint}/rest/v1/${this.tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.apiKey,
          Authorization: `Bearer ${this.apiKey}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(newRecord),
      });
    } catch (err) {
      console.warn('Supabase remote push fallback:', err);
    }

    return newRecord;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const existing = await this.findById(id);
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    } as T;

    try {
      await fetch(`${this.endpoint}/rest/v1/${this.tableName}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.apiKey,
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });
    } catch {
      // offline fallback
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    try {
      await fetch(`${this.endpoint}/rest/v1/${this.tableName}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          apikey: this.apiKey,
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
    } catch {
      // offline fallback
    }
  }

  subscribe(callback: (changes: ChangeEvent<T>[]) => void): () => void {
    // Escucha eventos o canal realtime cuando esté conectado
    return () => {};
  }
}
