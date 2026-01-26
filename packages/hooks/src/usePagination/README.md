---
nav: Hooks
group:
  title: 分页
  order: 1
---

# usePagination

封装常用分页搜索逻辑

## 代码演示

### 基础用法

<code src="./demos/basic.tsx"></code>

## 结合表单搜索

<code src="./demos/search.tsx"></code>

## API

```tsx | pure
import { DependencyList } from 'react'
import { FormInstance } from 'antd'
import { Nullable } from '@chaomingd/utils'
import React from 'react'
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

export interface IData<T> {
  total: number;
  list: T[];
}

export type TService<
  TDataItem extends any = any,
  TFormValues extends Record<string, any> = Record<string, any>,
> = (
  current: number,
  pageSize: number,
  formValues?: TFormValues,
  ...args: any[]
) => Promise<Nullable<IData<TDataItem>>>;

// const returnValue = usePagination(service: TService, params?: UsePaginationParams<TDataItem>)
```

### params


| 参数名          | 类型                 | 必填 | 描述                                                                    | 默认值 |
| ----------------- | ---------------------- | ------ | ------------------------------------------------------------------------- | -------- |
| defaultData     | TDataItem[]          | 否   | 默认数据                                                                | 无     |
| defaultPageSize | number               | 否   | 默认的页大小                                                            | 10     |
| defaultCurrent  | number               | 否   | 默认的页码                                                              | 1      |
| refreshDeps     | React.DependencyList | 否   | 依赖项发生改变时，自动更新数据                                          | 无     |
| form            | FormInstance         | 否   | 表单实例，结合搜索时需要                                                | 无     |
| manu            | bool                 | 否   | 手动更新，当设置为true时，需要手动调用 refresh 或者 search 方法更新数据 | true   |
