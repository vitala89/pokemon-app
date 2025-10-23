import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CacheService } from '@app/core';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(CacheService);
  });

  afterEach(() => {
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      const key = 'test-key';
      const data = { name: 'Pikachu', id: 25 };

      service.set(key, data);
      const result = service.get(key);

      expect(result).toEqual(data);
    });

    it('should return null for non-existent key', () => {
      const result = service.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should handle different data types', () => {
      service.set('string', 'test');
      service.set('number', 42);
      service.set('boolean', true);
      service.set('array', [1, 2, 3]);
      service.set('object', { a: 1, b: 2 });

      expect(service.get('string')).toBe('test');
      expect(service.get('number')).toBe(42);
      expect(service.get('boolean')).toBe(true);
      expect(service.get('array')).toEqual([1, 2, 3]);
      expect(service.get('object')).toEqual({ a: 1, b: 2 });
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should return data before TTL expires', (done) => {
      const key = 'test-ttl';
      const data = 'test-data';

      service.set(key, data);

      setTimeout(() => {
        const result = service.get(key, 1000); // 1 second TTL
        expect(result).toBe(data);
        done();
      }, 100);
    });

    it('should return null after TTL expires', (done) => {
      const key = 'test-expired';
      const data = 'test-data';

      service.set(key, data);

      setTimeout(() => {
        const result = service.get(key, 100); // 100ms TTL
        expect(result).toBeNull();
        done();
      }, 200);
    });

    it('should use default TTL if not specified', () => {
      const key = 'test-default-ttl';
      const data = 'test-data';

      service.set(key, data);
      const result = service.get(key);

      expect(result).toBe(data);
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      service.set('test-key', 'test-data');
      expect(service.has('test-key')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(service.has('non-existent')).toBe(false);
    });

    it('should return false for expired key', (done) => {
      service.set('test-expired', 'data');

      setTimeout(() => {
        expect(service.has('test-expired', 100)).toBe(false);
        done();
      }, 200);
    });
  });

  describe('delete', () => {
    it('should delete existing key', () => {
      service.set('test-key', 'test-data');
      expect(service.has('test-key')).toBe(true);

      service.delete('test-key');
      expect(service.has('test-key')).toBe(false);
    });

    it('should not throw error when deleting non-existent key', () => {
      expect(() => service.delete('non-existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all cached data', () => {
      service.set('key1', 'data1');
      service.set('key2', 'data2');
      service.set('key3', 'data3');

      expect(service.size()).toBe(3);

      service.clear();

      expect(service.size()).toBe(0);
      expect(service.get('key1')).toBeNull();
      expect(service.get('key2')).toBeNull();
      expect(service.get('key3')).toBeNull();
    });
  });

  describe('size', () => {
    it('should return correct cache size', () => {
      expect(service.size()).toBe(0);

      service.set('key1', 'data1');
      expect(service.size()).toBe(1);

      service.set('key2', 'data2');
      expect(service.size()).toBe(2);

      service.delete('key1');
      expect(service.size()).toBe(1);

      service.clear();
      expect(service.size()).toBe(0);
    });
  });

  describe('overwriting data', () => {
    it('should overwrite existing key with new data', () => {
      const key = 'test-key';

      service.set(key, 'old-data');
      expect(service.get(key)).toBe('old-data');

      service.set(key, 'new-data');
      expect(service.get(key)).toBe('new-data');
    });

    it('should maintain only one entry when overwriting', () => {
      service.set('key', 'data1');
      expect(service.size()).toBe(1);

      service.set('key', 'data2');
      expect(service.size()).toBe(1);
    });
  });
});
