const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
const imageMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
];
export function isImage(ext: string, type: string) {
  if (imageExtensions.includes(ext)) {
    return true;
  }
  return imageMimeTypes.includes(type);
}
