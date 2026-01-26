import fileTypeChecker from 'file-type-checker';
import { getExt } from './getExt';

function trimDot(str: string) {
  if (str[0] === '.') {
    return str.slice(1);
  }
  return str;
}

export function validateFileTypes(
  file: File,
  types: string[],
): Promise<{
  isValid: boolean;
  fileInfo: {
    extension: string;
    mimeType: string;
    description: string;
  };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const ext = getExt(file.name);
      if (reader.result) {
        try {
          const isValid = fileTypeChecker.validateFileType(
            reader.result as ArrayBuffer,
            types.map((type) => trimDot(type)),
          );
          const fileInfo = fileTypeChecker.detectFile(reader.result as ArrayBuffer)! || {
            extension: ext,
            mimeType: file.type,
            description: file.type,
          };
          resolve({
            isValid,
            fileInfo,
          });
        } catch (e) {
          resolve({
            isValid: types.map((type) => trimDot(type)).includes(ext),
            fileInfo: { extension: ext, mimeType: file.type, description: file.type } as any,
          });
        }
        return;
      }
      reject(new Error('reader arraybuffer empty'));
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsArrayBuffer(file);
  });
}

export function getFileInfo(file: File): Promise<{
  extension: string;
  mimeType: string;
  description: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        try {
          const fileInfo = fileTypeChecker.detectFile(reader.result as ArrayBuffer)!;
          if (fileInfo) {
            resolve(fileInfo);
            return;
          }
          resolve({ extension: getExt(file.name), mimeType: file.type, description: file.type });
        } catch (e) {
          console.warn('file-type-checker error', e);
          resolve({ extension: getExt(file.name), mimeType: file.type, description: file.type });
        }
        return;
      }
      reject(new Error('reader arraybuffer empty'));
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsArrayBuffer(file);
  });
}
