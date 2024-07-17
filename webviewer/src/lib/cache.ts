import { env } from '$env/dynamic/private';
import { createClient, type RedisClientType } from 'redis';

let redis: RedisClientType

export async function createRedis() {
  if (!redis) {
    redis = createClient({
      url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`
    });
    redis.on('error', err => console.log('[redis]', err));
  }

  if (!redis.isOpen) {
    await redis.connect()
  }
  return redis
}

// export function serialize(data: any): string {
//   return JSON.stringify(data, (key, value) => {
//     if (value instanceof Map) {
//       return {
//         _type: 'Map',
//         _data: Array.from(value.entries()),
//       };
//     } else if (value instanceof Date) {
//       return {
//         _type: 'Date',
//         _data: value.toISOString(),
//       };
//     }
//     return value;
//   });
// }
//
// export function deserialize(jsonString: string): any {
//   return JSON.parse(jsonString, (key, value) => {
//     if (value && typeof value === 'object') {
//       if (value._type === 'Map') {
//         return new Map(value._data);
//       } else if (value._type === 'Date') {
//         return new Date(value._data);
//       }
//     }
//     return value;
//   });
// }

export function serialize(data: any): string {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Map) {
      return {
        _type: 'Map',
        _data: Array.from(value.entries()),
      };
    }
    // Dates are now serialized as ISO strings without special treatment
    return value;
  });
}

export function deserialize(jsonString: string): any {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

  return JSON.parse(jsonString, (key, value) => {
    if (value && typeof value === 'object') {
      if (value._type === 'Map') {
        return new Map(value._data);
      }
    } else if (typeof value === 'string' && isoDateRegex.test(value)) {
      // If the string matches ISO date format, convert it to a Date object
      return new Date(value);
    }
    return value;
  });
}
