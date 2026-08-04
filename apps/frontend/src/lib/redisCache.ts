import { Redis } from '@upstash/redis';

// High-Speed In-Memory Cache Fallback
const inMemoryCache = new Map<string, { data: any; expiresAt: number }>();

const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch {
      console.warn('[RedisCache] Failed to initialize Upstash Redis instance, falling back to In-Memory cache.');
    }
  }
  return null;
};

const redis = getRedisClient();

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    if (redis) {
      const cached = await redis.get<T>(key);
      if (cached) return cached;
    }
  } catch (err) {
    console.error('[RedisCache GET Error]', err);
  }

  // Fallback to In-Memory Cache
  const memoryItem = inMemoryCache.get(key);
  if (memoryItem) {
    if (Date.now() < memoryItem.expiresAt) {
      return memoryItem.data as T;
    }
    inMemoryCache.delete(key);
  }

  return null;
};

export const cacheSet = async (key: string, data: any, ttlSeconds: number = 60): Promise<void> => {
  try {
    if (redis) {
      await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
    }
  } catch (err) {
    console.error('[RedisCache SET Error]', err);
  }

  // Set In-Memory Cache
  inMemoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const cacheDel = async (keyPrefixOrPattern: string): Promise<void> => {
  try {
    if (redis) {
      // BUG 10 FIX: Use SCAN to find all keys matching the prefix pattern
      let cursor: string | number = 0;
      do {
        const result = await redis.scan(cursor as number, { match: `${keyPrefixOrPattern}*`, count: 100 });
        cursor = result[0];
        const keys = result[1] as string[];
        if (keys.length > 0) {
          await Promise.all(keys.map(k => redis!.del(k)));
        }
      } while (cursor !== 0 && cursor !== '0');
    }
  } catch (err) {
    console.error('[RedisCache DEL Error]', err);
  }

  // Delete from In-Memory Cache
  for (const key of inMemoryCache.keys()) {
    if (key.startsWith(keyPrefixOrPattern)) {
      inMemoryCache.delete(key);
    }
  }
};
