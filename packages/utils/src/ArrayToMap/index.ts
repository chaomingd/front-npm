// 数组转对象
export function arrayToMap<
  T = any,
  GetValue extends (item: T) => any = () => T,
>(arr: T[], getKey?: (item: T) => string, getValue?: GetValue) {
  const map: Record<string, ReturnType<GetValue>> = {};
  const _getValue = getValue || ((item: T) => item);
  const _getKey = getKey || ((item) => item);
  if (!arr) return map;
  arr.forEach((item) => {
    map[_getKey(item) as string] = _getValue(item);
  });
  return map;
}
