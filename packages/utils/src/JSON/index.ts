import { underLineToCamelCase, cameCaseToUnderLine } from '../String';

export function safeJSONParse<T = any>(jsonStr: string, fallback?: any) {
  let res: T;
  try {
    res = JSON.parse(jsonStr);
  } catch (error) {
    res = fallback;
  }
  return res;
}

export function camelCaseJSON(json: Record<string, any>) {
  try {
    Object.keys(json).forEach((key) => {
      json[underLineToCamelCase(key)] = json[key];
    });
  } catch (error) {}
  return json;
}

export function underLineJSON(json: Record<string, any>) {
  const res: Record<string, any> = {}
  try {
    Object.keys(json).forEach(key => {
      res[cameCaseToUnderLine(key)] = json[key]
    })
  } catch(error) {}
  return res;
}


