
export function getExt(fileName: string) {
  if (!fileName) return '';
  const lastIndex = fileName.lastIndexOf('.');
  if (lastIndex === -1) return '';
  return fileName.slice(lastIndex + 1);
}
