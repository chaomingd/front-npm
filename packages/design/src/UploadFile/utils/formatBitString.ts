

export function formatBitString(bit: number) {
  const units = ['B', 'K', 'M', 'G'];
  const base = 1024;
  for (let i = 0; i < units.length; i++) {
    const n = Math.pow(base, i + 1);
    if (bit < n) return `${+(bit / (n / 1024)).toFixed(2)} ${units[i]}`;
  }
  return `${+(bit / Math.pow(1024, 3)).toFixed(2)} T`;
}
