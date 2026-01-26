import { isSameObject } from '@chaomingd/utils';
export function shallowEqualKeys(obj1: object, obj2: object, keys?: string[]) {
  if (!obj1 || !obj2) return false;
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    return isSameObject(obj1, obj2, keys);
  }
  return false;
}
