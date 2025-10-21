import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTtl = 5 * 60 * 1000;

  /**
   * Get data from cache
   * @param key - Cache key
   * @param ttl - Time to live in milliseconds (optional)
   * @returns Cached data or null if not found/expired
   */
  get<T>(key: string, ttl: number = this.defaultTtl): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Check if key exists in cache and is not expired
   * @param key - Cache key
   * @param ttl - Time to live in milliseconds (optional)
   * @returns True if exists and not expired
   */
  has(key: string, ttl: number = this.defaultTtl): boolean {
    return this.get(key, ttl) !== null;
  }

  /**
   * Delete specific cache entry
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns Number of cached entries
   */
  size(): number {
    return this.cache.size;
  }
}
