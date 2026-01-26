import { find, isNaN } from 'lodash';
/**
 * 是否为空值，包括 null、undefined、'' 和 NaN
 */
export function isNullValue(value: any) {
  return value === null || value === undefined || value === '' || isNaN(value);
}
export type FindByValueType = string | number | boolean | null | undefined;
/**
 * 找到属性 value 对应的值和目标值相等的数组对象
 */
export function findByValue<T extends { value: FindByValueType }>(
  array: T[],
  value: FindByValueType,
) {
  return find(array, (item) => item && item.value === value) || ({} as T);
}
