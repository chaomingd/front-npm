import { Nullable } from '@chaomingd/utils';
import { FormInstance } from 'antd';
import { DependencyList } from 'react';
import { Model } from '@chaomingd/store';
import { IResponsiveConfigItem } from '../useResponsive';

export type TMediaQueryItem = IResponsiveConfigItem<{
  col: number;
  row: number;
}>;

export interface UsePaginationParams<TDataItem extends any = any> {
  // 默认数据
  defaultData?: TDataItem[];
  // 默认pageSize
  defaultPageSize?: number;
  // 默认的页码
  defaultCurrent?: number;
  // 依赖项，当依赖发生改变时，自动更新数据
  refreshDeps?: DependencyList;
  // 表单实例
  form?: FormInstance;
  // 是否手动调用更新函数，当设置为 false，更新数据需要手动调用 refresh
  manu?: boolean;
}

export interface IData {
  totalCount?: number;
  items?: any[];
  total?: number;
  list?: any[];
}

export type TService<
  TData extends IData = any,
  TFormValues extends Record<string, any> = Record<string, any>,
> = (
  current: number,
  pageSize: number,
  formValues: TFormValues,
  ...args: any[]
) => Promise<Nullable<TData>>;

export interface fetchDataOptions {
  showLoading?: boolean;
}

export interface UsePaginationReturnValue<TData extends IData = any> {
  // 状态管理，一般无需使用，model.setState({}) 方法可更新数据
  model: Model<IUsePaginationState<TData>, UsePaginationEffects>;
  // 列表数据
  items: TData['items'];
  list: TData['list'];
  data?: TData;
  // loading 状态
  loading: boolean;
  // 分页属性，配合分页组件使用
  paginationProps: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (current: number, pageSize: number) => void;
    pageSizeOptions: number[];
  };
  // 重新获取数据
  refresh: (
    options?: fetchDataOptions,
    ...args: any[]
  ) => Promise<Nullable<TData>>;
  // 重置表单
  reset: (
    options?: fetchDataOptions,
    ...args: any[]
  ) => Promise<Nullable<TData>>;
  // 表单搜索
  search: (
    options?: fetchDataOptions,
    ...args: any[]
  ) => Promise<Nullable<TData>>;
}

export interface UsePaginationReturnValueWidthResponsive<
TData extends IData = any,
> extends UsePaginationReturnValue<TData> {
  mediaQueryMatchedItem: TMediaQueryItem;
  matchMedia: () => void;
}
export interface UsePaginationReturnValueWidthListLayout<
  TData extends IData = any,
> extends UsePaginationReturnValue<TData> {
  col: number;
  row: number;
}

export interface UsePaginationEffects<TData extends IData = any> {
  fetchData: (
    options?: {
      showLoading?: boolean;
    },
    ...args: any[]
  ) => Promise<Nullable<TData>>;
}

export interface IUsePaginationState<TData extends IData = any> {
  items: TData['items'];
  loading: boolean;
  current: number;
  pageSize: number;
  totalCount: number;
  pageSizeOptions: number[];
  data?: TData;
  total: number;
  list: TData['items'];
}
