import { Product, RedisCacheStats, CacheLogEntry } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null; // null for no expiry, timestamp for TTL
  createdAt: number;
  sizeBytes: number;
}

class RedisCacheService {
  private store = new Map<string, CacheEntry<unknown>>();
  private stats: RedisCacheStats = {
    hits: 42,
    misses: 4,
    totalRequests: 46,
    hitRatio: 91.3,
    avgCachedMs: 0.9,
    avgUncachedMs: 84.5,
    keysCount: 0,
    memoryUsedBytes: 0,
    recentLogs: [],
    cacheEnabled: true,
  };

  private listeners: Array<(stats: RedisCacheStats) => void> = [];

  constructor() {
    // Seed initial Redis cache with primary product catalogs
    this.warmCache();
  }

  public subscribe(listener: (stats: RedisCacheStats) => void): () => void {
    this.listeners.push(listener);
    listener({ ...this.stats });
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.recalculateStats();
    const snapshot = { ...this.stats };
    this.listeners.forEach(fn => fn(snapshot));
  }

  private recalculateStats() {
    let totalBytes = 0;
    const now = Date.now();

    // Clean expired keys and calculate memory
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && entry.expiresAt <= now) {
        this.store.delete(key);
      } else {
        totalBytes += entry.sizeBytes + key.length * 2;
      }
    }

    this.stats.keysCount = this.store.size;
    this.stats.memoryUsedBytes = totalBytes;
    const total = this.stats.hits + this.stats.misses;
    this.stats.totalRequests = total;
    this.stats.hitRatio = total > 0 ? Number(((this.stats.hits / total) * 100).toFixed(1)) : 0;
  }

  private estimateSize(value: unknown): number {
    try {
      return new TextEncoder().encode(JSON.stringify(value)).length;
    } catch {
      return 128;
    }
  }

  public async get<T>(key: string, fetchFallback?: () => Promise<T> | T, ttlSeconds: number = 120): Promise<{ data: T; fromCache: boolean; durationMs: number }> {
    const startTime = performance.now();

    if (!this.stats.cacheEnabled) {
      // Cache is bypassed: fetch directly
      const data = fetchFallback ? await fetchFallback() : (null as unknown as T);
      const simulatedDuration = Number((Math.random() * 40 + 60).toFixed(2));
      const log: CacheLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        key,
        status: 'MISS',
        durationMs: simulatedDuration,
        timestamp: Date.now(),
        sizeBytes: this.estimateSize(data),
      };
      this.stats.misses++;
      this.stats.recentLogs = [log, ...this.stats.recentLogs.slice(0, 49)];
      this.notify();
      return { data, fromCache: false, durationMs: simulatedDuration };
    }

    const now = Date.now();
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (entry && (!entry.expiresAt || entry.expiresAt > now)) {
      // Cache HIT: ultra-low latency (< 1.5ms)
      const durationMs = Number((performance.now() - startTime + Math.random() * 0.7 + 0.3).toFixed(2));
      this.stats.hits++;
      const log: CacheLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        key,
        status: 'HIT',
        durationMs,
        timestamp: now,
        sizeBytes: entry.sizeBytes,
      };
      this.stats.recentLogs = [log, ...this.stats.recentLogs.slice(0, 49)];
      this.notify();
      return { data: entry.value, fromCache: true, durationMs };
    }

    // Cache MISS: simulate database fetch latency (~65 - 110ms)
    this.stats.misses++;
    const data = fetchFallback ? await fetchFallback() : (null as unknown as T);
    const durationMs = Number((Math.random() * 45 + 65).toFixed(2));

    if (data !== undefined && data !== null) {
      this.set(key, data, ttlSeconds);
    }

    const log: CacheLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      key,
      status: 'MISS',
      durationMs,
      timestamp: now,
      sizeBytes: this.estimateSize(data),
    };
    this.stats.recentLogs = [log, ...this.stats.recentLogs.slice(0, 49)];
    this.notify();

    return { data, fromCache: false, durationMs };
  }

  public set<T>(key: string, value: T, ttlSeconds: number = 120): void {
    const sizeBytes = this.estimateSize(value);
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, {
      value,
      expiresAt,
      createdAt: Date.now(),
      sizeBytes,
    });
    this.notify();
  }

  public del(keyPattern: string): number {
    let deletedCount = 0;
    if (keyPattern.includes('*')) {
      const regex = new RegExp('^' + keyPattern.replace(/\*/g, '.*') + '$');
      for (const key of this.store.keys()) {
        if (regex.test(key)) {
          this.store.delete(key);
          deletedCount++;
        }
      }
    } else {
      if (this.store.delete(keyPattern)) {
        deletedCount = 1;
      }
    }
    this.notify();
    return deletedCount;
  }

  public flushAll(): void {
    this.store.clear();
    this.stats.recentLogs = [];
    this.notify();
  }

  public warmCache(): void {
    // Pre-cache full catalog & categorized sub-catalogs
    this.set('catalog:all', INITIAL_PRODUCTS, 300);
    this.set('catalog:category:input', INITIAL_PRODUCTS.filter(p => p.category === 'input'), 300);
    this.set('catalog:category:displays', INITIAL_PRODUCTS.filter(p => p.category === 'displays'), 300);
    this.set('catalog:category:audio', INITIAL_PRODUCTS.filter(p => p.category === 'audio'), 300);
    this.set('catalog:category:desk', INITIAL_PRODUCTS.filter(p => p.category === 'desk'), 300);
    
    // Cache individual high-traffic item lookups
    INITIAL_PRODUCTS.forEach(p => {
      this.set(`product:${p.id}`, p, 300);
      this.set(`inventory:stock:${p.id}`, p.availableQty, 120);
    });

    this.notify();
  }

  public toggleCache(enabled?: boolean): boolean {
    this.stats.cacheEnabled = enabled !== undefined ? enabled : !this.stats.cacheEnabled;
    this.notify();
    return this.stats.cacheEnabled;
  }

  public getStats(): RedisCacheStats {
    this.recalculateStats();
    return { ...this.stats };
  }

  public getKeysList(): Array<{ key: string; size: number; ttlSecondsRemaining: number; createdAt: number }> {
    const list: Array<{ key: string; size: number; ttlSecondsRemaining: number; createdAt: number }> = [];
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      const ttlRemaining = entry.expiresAt ? Math.max(0, Math.round((entry.expiresAt - now) / 1000)) : -1;
      list.push({
        key,
        size: entry.sizeBytes,
        ttlSecondsRemaining: ttlRemaining,
        createdAt: entry.createdAt,
      });
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Simulates high traffic burst requests against the Redis cache
   * demonstrating resilience under concurrent load
   */
  public async simulateTrafficBurst(requestCount: number = 100, onProgress?: (completed: number, total: number) => void): Promise<{
    completedRequests: number;
    hits: number;
    misses: number;
    avgLatencyMs: number;
    p99LatencyMs: number;
    throughputReqSec: number;
    savedDbQueries: number;
  }> {
    const latencies: number[] = [];
    let hits = 0;
    let misses = 0;
    const startTime = performance.now();

    const keysToQuery = [
      'catalog:all',
      'catalog:category:input',
      'catalog:category:displays',
      'catalog:category:audio',
      'product:1',
      'product:2',
      'product:3',
      'inventory:stock:1',
      'inventory:stock:2',
      'catalog:all',
    ];

    for (let i = 0; i < requestCount; i++) {
      const targetKey = keysToQuery[Math.floor(Math.random() * keysToQuery.length)];
      // Randomly simulate 5% un-cached queries
      const isUncachedKey = Math.random() < 0.05 ? `query:search:${Math.random().toString(36).substring(2, 6)}` : targetKey;

      const result = await this.get(isUncachedKey, () => {
        return INITIAL_PRODUCTS.slice(0, 3);
      }, 60);

      latencies.push(result.durationMs);
      if (result.fromCache) {
        hits++;
      } else {
        misses++;
      }

      if (onProgress && i % 10 === 0) {
        onProgress(i + 1, requestCount);
      }
    }

    if (onProgress) {
      onProgress(requestCount, requestCount);
    }

    const totalDurationSec = (performance.now() - startTime) / 1000;
    latencies.sort((a, b) => a - b);
    const avgLatencyMs = Number((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2));
    const p99Index = Math.floor(latencies.length * 0.99);
    const p99LatencyMs = Number((latencies[p99Index] || latencies[latencies.length - 1]).toFixed(2));
    const throughputReqSec = Math.round(requestCount / Math.max(0.05, totalDurationSec));

    return {
      completedRequests: requestCount,
      hits,
      misses,
      avgLatencyMs,
      p99LatencyMs,
      throughputReqSec,
      savedDbQueries: hits,
    };
  }
}

export const redisCache = new RedisCacheService();
