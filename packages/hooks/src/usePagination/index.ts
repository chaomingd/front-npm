import { useLatest } from 'ahooks';
import { Model, createAsyncEffect, useModel } from '@chaomingd/store';
import {
  TService,
  UsePaginationEffects,
  TMediaQueryItem,
  UsePaginationParams,
  UsePaginationReturnValue,
  UsePaginationReturnValueWidthResponsive,
  IUsePaginationState,
  UsePaginationReturnValueWidthListLayout,
  IData,
} from './type';
import { useResponsive } from '../useResponsive';
import { useEffect } from 'react';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from './constant';
import { UseListLayoutConfig, useListLayout } from '../useListLayout';
import { gerationPageSizeOptions } from './utils';

export function usePagination<
  TData extends IData = any,
  TFormValues extends Record<string, any> = Record<string, any>,
>(service: TService<TData, TFormValues>, params?: UsePaginationParams) {
  const serviceRef = useLatest(service);
  const paramsRef = useLatest(params);
  const model: Model<IUsePaginationState<TData>, UsePaginationEffects> = useModel<
    IUsePaginationState<TData>,
    UsePaginationEffects
  >({
    state: {
      items: params?.defaultData || [],
      current: params?.defaultCurrent || 1,
      pageSize: params?.defaultPageSize || DEFAULT_PAGE_SIZE,
      loading: false,
      totalCount: 0,
      pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
      total: 0,
      list: [],
    },
    effects: {
      fetchData: createAsyncEffect(
        async () => {
          const form = paramsRef.current?.form;
          const { current, pageSize } = model.getState();
          if (!pageSize) return null;
          const res = await serviceRef
            .current?.(current, pageSize, form ? form.getFieldsValue() : {})
            .catch((err) => console.log(err));
          if (res) {
            return {
              items: res.list || res.items || [],
              totalCount: res.total || res.totalCount || 0,
              data: res,
            };
          }
          return null;
        },
        {
          loadingKey: 'loading',
        },
      ),
    },
  });
  useEffect(() => {
    if (paramsRef.current?.manu !== true) {
      model.getEffect('fetchData')();
    }
  }, params?.refreshDeps || []);
  const state = model.useGetState();

  const returnValue: UsePaginationReturnValue<TData> = {
    model,
    items: state.items,
    list: state.list,
    data: state.data,
    loading: state.loading,
    refresh: (options) => {
      return model.getEffect('fetchData')(options);
    },
    search: (options) => {
      model.setState(
        {
          current: 1,
        },
        {
          silent: true,
        },
      );
      return model.getEffect('fetchData')(options);
    },
    reset: (options) => {
      model.setState(
        {
          current: 1,
        },
        {
          silent: true,
        },
      );
      const form = paramsRef.current?.form;
      if (form) {
        form.resetFields();
      }
      return model.getEffect('fetchData')(options);
    },
    paginationProps: {
      current: state.current,
      pageSize: state.pageSize,
      pageSizeOptions: state.pageSizeOptions,
      total: state.totalCount,
      onChange: (current, pageSize) => {
        model.setState(
          {
            current,
            pageSize,
          },
          {
            silent: true,
          },
        );
        model.getEffect('fetchData')();
      },
    },
  };
  return returnValue;
}

export function usePaginationWithResponsive<
  TData extends IData = any,
  TFormValues extends Record<string, any> = Record<string, any>,
>(
  service: TService<TData, TFormValues>,
  params: UsePaginationParams & { mediaQuery: TMediaQueryItem[] },
) {
  const paginationValue = usePagination<TData, TFormValues>(
    service,
    params,
  ) as UsePaginationReturnValueWidthResponsive<TData>;
  const { mediaQueryMatchedItem, matchMedia } = useResponsive({
    mediaQuery: params.mediaQuery,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onChange: (mediaQueryMatchedItem) => {
      const pageSize = mediaQueryMatchedItem.data.col * mediaQueryMatchedItem.data.row;
      const pageSizeOptions = gerationPageSizeOptions(pageSize);
      paginationValue.model.setState(
        {
          pageSizeOptions,
          pageSize,
        },
        {
          silent: true,
        },
      );
      paginationValue.refresh();
    },
  });
  paginationValue.mediaQueryMatchedItem = mediaQueryMatchedItem!;
  paginationValue.matchMedia = matchMedia;
  return paginationValue;
}

/**
 * 列表布局
 */
export function usePaginationWithListLayout<
  TData extends IData = any,
  TFormValues extends Record<string, any> = Record<string, any>,
>(
  service: TService<TData, TFormValues>,
  params: UsePaginationParams & {
    listLayoutConfig: UseListLayoutConfig & { row?: number };
  },
) {
  const paginationValue = usePagination<TData, TFormValues>(service, {
    ...(params || {}),
    manu: true,
  }) as UsePaginationReturnValueWidthListLayout<TData>;
  const listLayout = useListLayout(params.listLayoutConfig);
  const row = Math.max(params.listLayoutConfig.row || 0, listLayout.row);
  useEffect(() => {
    if (row) {
      const pageSize = row * listLayout.col;
      const pageSizeOptions = gerationPageSizeOptions(pageSize);
      paginationValue.model.setState(
        {
          pageSizeOptions,
          pageSize,
          current: 1,
        },
        {
          silent: true,
        },
      );
      paginationValue.refresh();
    }
  }, [listLayout, ...(params.refreshDeps || [])]);
  Object.assign(paginationValue, listLayout);
  paginationValue.row = row;
  return paginationValue;
}
