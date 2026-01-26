import { ReactNode } from 'react';

export type Key = string | number | symbol;

export interface CheckGroupProps<K extends Key> {
  value?: K[];
  onChange?: (val: K[]) => void;
  children?: ReactNode | ReactNode[];
  keys?: K[];
  multiple?: boolean;
}

export interface CheckGroupState<K extends Key> {
  value: K[];
  valueMap: Map<K, boolean>;
  keys: K[];
  isCheckAll: boolean;
  indeterminate: boolean;
}

type CheckItemChildren =
  | ReactNode
  | ReactNode[]
  | ((props: {
      checked: boolean;
      indeterminate: boolean;
      onChange: () => void;
    }) => ReactNode | ReactNode[]);

export interface CheckItemProps<K extends Key> {
  value: K;
  children?: CheckItemChildren;
  disabled?: boolean;
  onChange?: (val: K) => void;
}
