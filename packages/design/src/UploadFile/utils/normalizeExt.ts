
export function normalizeExt(ext: string) {
  if (ext[0] === '.') return ext;
  return '.' + ext;
}
