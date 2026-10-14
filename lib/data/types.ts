/**
 * Data Access Layer (DAL) Types & Contracts
 * Arquitectura Agnóstica y Desacoplada de Base de Datos para OMNEX
 * Soluciones Integrales y Globales SM
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  _syncStatus?: 'PENDING' | 'SYNCED' | 'CONFLICT';
  _version?: number;
}

export interface QueryFilter {
  limit?: number;
  offset?: number;
  where?: Record<string, unknown>;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ChangeEvent<T> {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  key: string;
  record?: T;
}

export interface IDataRepository<T extends BaseEntity> {
  findAll(filter?: QueryFilter): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count?(): Promise<number>;
  subscribe?(callback: (changes: ChangeEvent<T>[]) => void): () => void;
}

export type DataBackendMode = 'local-dexie' | 'supabase-hybrid' | 'postgres-edge';
