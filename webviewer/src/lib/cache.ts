import { env } from '$env/dynamic/private';
import { createClient } from 'redis';

export async function createRedis() {
  const redis = createClient({
    url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`
  });

  redis.on('error', err => console.log('[redis]', err));
  await redis.connect()
  return redis
}
export function serialize(data: any): string {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Map) {
      return {
        _type: 'Map',
        _data: Array.from(value.entries()),
      };
    } else if (value instanceof Date) {
      return {
        _type: 'Date',
        _data: value.toISOString(),
      };
    }
    return value;
  });
}

export function deserialize(jsonString: string): any {
  return JSON.parse(jsonString, (key, value) => {
    if (value && typeof value === 'object') {
      if (value._type === 'Map') {
        return new Map(value._data);
      } else if (value._type === 'Date') {
        return new Date(value._data);
      }
    }
    return value;
  });
}
