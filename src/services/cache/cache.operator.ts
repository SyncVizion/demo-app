import { isAfter } from 'date-fns';
import { Observable, of, tap } from 'rxjs';

export interface CacheData {
  cacheExpires?: Date;
  insertDateTime: Date;
  data: any;
}

const cacheData = new Map<string, CacheData>();

/**
 * Cacheable Method Decorator
 *
 * @param cacheKey The cache key
 * @param expiry The expire amount in minutes (How long it should be cached), default is indefinite
 * @returns The method decorator
 */
export function Cacheable(cacheKey: string, expiry?: number): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const uniqueKey = `${cacheKey} (${args.toString()})`;
      if (cacheData.has(uniqueKey)) {
        const foundCache = cacheData.get(uniqueKey);

        if (foundCache.cacheExpires) {
          if (isAfter(new Date(), foundCache.cacheExpires)) {
            const result = originalMethod.apply(this, args) as Observable<any>;
            return refreshCache(uniqueKey, expiry, cacheData, result);
          }
        }

        return of(foundCache.data);
      } else {
        const result = originalMethod.apply(this, args) as Observable<any>;
        return refreshCache(uniqueKey, expiry, cacheData, result);
      }
    };
  };
}

/**
 * Refresh the cache. Will update the cache with the new data.
 *
 * @param cacheKey The cache key
 * @param expiry The expire time in minutes
 * @param cacheData The cache data
 * @param res The observable response
 * @returns The observable response
 */
function refreshCache(cacheKey: string, expiry: number, cacheData: Map<string, CacheData>, res: Observable<any>) {
  return res.pipe(
    tap((res) => {
      const currentDate = new Date();
      const newCacheData: CacheData = {
        insertDateTime: currentDate,
        data: res,
      };

      if (expiry) {
        const expireDate = currentDate;
        expireDate.setMinutes(expireDate.getMinutes() + expiry);
        newCacheData.cacheExpires = expireDate;
      }

      cacheData.set(cacheKey, newCacheData);
    }),
  );
}

export class CacheableStorage {
  static clearAll() {
    cacheData.clear();
  }

  static clear(key: string, ...args: any[]) {
    if (args?.length > 0) {
      cacheData.delete(`${key} (${args.toString()})`);
    } else {
      cacheData.forEach((v, k) => {
        if (k.startsWith(key)) {
          cacheData.delete(k);
        }
      });
    }
  }
}
