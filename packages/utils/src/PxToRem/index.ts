export function pxtorem(px: number, precision = 5) {
  if (px === 0) return undefined;
  return `${(px / 16).toFixed(precision)}rem`;
}
