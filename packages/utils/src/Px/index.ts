export function px(n: number) {
  if (window.innerWidth > 1920) {
    return Math.round(n / 1920 * window.innerWidth);
  }
  return n;
}
