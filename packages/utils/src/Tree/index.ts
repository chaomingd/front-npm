import { Nullable } from '../types';

interface ITreeOptions {
  children: string;
}

export function treeMap<T = any, R = any>(
  treeDatas: T[],
  interator: (item: T, index: number, parent: T | null, level: number, localIndex: number) => R,
  options?: ITreeOptions,
) {
  const res: R[] = [];
  treeForEach(
    treeDatas,
    (item, index, parent, level, localIndex) => {
      res.push(interator(item, index, parent, level, localIndex));
    },
    options,
  );
  return res;
}

export function treeToMap<T = any>(
  treeDatas: Nullable<T[]>,
  getKey: (item: T, index: number, parent: T | null, level: number, localIndex: number) => string,
  options?: ITreeOptions,
) {
  const map: Record<string, T> = {};
  if (!treeDatas) return {};
  treeForEach(
    treeDatas,
    (item, index, parent, level, localIndex) => {
      map[getKey(item, index, parent, level, localIndex)] = item;
    },
    options,
  );
  return map;
}

export function treeFilter<T = any>(
  treeDatas: T[],
  interator: (item: T, index: number, parent: T | null, level: number) => boolean,
  options?: ITreeOptions,
) {
  const res: T[] = [];
  treeForEach(
    treeDatas,
    (item, index, parent, level) => {
      if (interator(item, index, parent, level)) {
        res.push(item);
      }
    },
    options,
  );
  return res;
}

export function treeForEach<T = any>(
  treeDatas: T[],
  interator: (item: T, index: number, parent: T | null, level: number, localIndex: number) => any,
  options?: ITreeOptions,
) {
  const childrenName = (options?.children || 'children') as string as keyof T;
  let index = 0;
  function walker(datas: T[], parent: T | null, level = 0) {
    datas &&
      datas.length &&
      datas.forEach((item, localIndex) => {
        interator(item, index++, parent, level, localIndex);
        if (item[childrenName] && (item[childrenName] as any).length) {
          walker(item[childrenName] as any, item, level + 1);
        }
      });
  }
  walker(treeDatas, null);
}

export function treeFind<T = any>(
  tree: T[],
  condition: (item: T, localIndex: number, index: number, level: number, parent: T | null) => boolean,
  options?: ITreeOptions,
) {
  return _treeFind(tree, condition, { index: 0 }, 0, null, options);
}

export function _treeFind<T = any>(
  tree: T[],
  condition: (item: T, localIndex: number, index: number, level: number, parent: T | null) => boolean,
  ref: {
    index: number;
    item?: T;
  },
  level: number,
  parent: T | null,
  options?: ITreeOptions,
): T | undefined {
  const childrenName = (options?.children || 'children') as string as keyof T;
  tree.find((item, localIndex) => {
    if (condition(item, localIndex, ref.index, level, parent)) {
      ref.item = item;
      return true;
    }
    ref.index++;
    if (item[childrenName] && (item[childrenName] as any).length) {
      const result = _treeFind(item[childrenName] as any, condition, ref, level + 1, item);
      if (result) {
        ref.item = result;
        return true;
      }
    }
    return false;
  });
  return ref.item;
}

export function treeModifyMap<T extends { children?: T[]; [key: string]: any }>(
  treeData: T[],
  modify: (item: T, parent: T | null, level: number, localIndex: number, index: number) => T,
  options?: { children?: string },
) {
  return _treeModifyMap(treeData, modify, { index: 0 }, null, 0, options);
}

function _treeModifyMap<T extends { children?: T[]; [key: string]: any }>(
  treeData: T[],
  modify: (item: T, parent: T | null, level: number, localIndex: number, index: number) => T,
  ref: {
    index: number;
  },
  parent: T | null,
  level: number,
  options?: { children?: string },
) {
  const childrenKey = options?.children || 'children';
  return treeData.map((item, localIndex) => {
    const newItem = modify(item, parent, level, localIndex, ref.index);
    ref.index++;
    if (item[childrenKey as any]) {
      (newItem as any)[childrenKey] = _treeModifyMap(
        item[childrenKey as any],
        modify,
        ref,
        newItem,
        level + 1,
        options,
      );
    }
    return newItem;
  });
}

export function treeModifyFilter<T extends { children?: T[]; [key: string]: any }>(
  treeData: T[],
  modify: (item: T, parent: T | null, level: number, localIndex: number, index: number) => boolean,
  options?: { children?: string },
) {
  return _treeModifyFilter(treeData, modify, {index: 0}, null, 0, options)
}


function _treeModifyFilter<T extends { children?: T[]; [key: string]: any }>(
  treeData: T[],
  modify: (item: T, parent: T | null, level: number, localIndex: number, index: number) => boolean,
  ref: {
    index: number;
  },
  parent: T | null,
  level: number,
  options?: { children?: string },
) {
  const childrenKey = options?.children || 'children';
  return treeData.filter((item, localIndex) => {
    const index = ref.index;
    ref.index++;
    if (item[childrenKey as any]) {
      (item as any)[childrenKey] = _treeModifyFilter(
        item[childrenKey as any],
        modify,
        ref,
        item,
        level + 1,
        options,
      );
    }
    const bool = modify(item, parent, level, localIndex, index);
    return bool;
  });
}