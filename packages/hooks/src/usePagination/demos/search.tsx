import { useDebounceFn } from 'ahooks';
import { Form, Input, Pagination } from 'antd';
import { usePagination } from '@chaomingd/hooks';
import React from 'react';

const items = [
  {
    name: '小明',
  },
  {
    name: '张三',
  },
  {
    name: '李四',
  },
  {
    name: '王五',
  },
  {
    name: '老刘',
  },
];

function getUserList(current: number, pageSize: number, formValues: FormValues) {
  return new Promise<{ total: number; list: DataItem[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        total: items.length,
        list: items.slice((current - 1) * pageSize, current * pageSize).filter((item) => {
          return item.name.includes(formValues.name);
        }),
      });
    }, 500);
  });
}

interface FormValues {
  name: string;
}
interface DataItem {
  name: string;
}

export default () => {
  const [form] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { data, loading, search, paginationProps } = usePagination(
    (current, pageSize, formValues: FormValues) => {
      return getUserList(current, pageSize, formValues);
    },
    {
      form,
    },
  );
  const { run: onValuesChange } = useDebounceFn(
    () => {
      search();
    },
    { wait: 500 },
  );
  return (
    <div>
      <Form form={form} onValuesChange={onValuesChange}>
        <Form.Item name="name">
          <Input placeholder="请输入名称" />
        </Form.Item>
      </Form>
      {loading && <div>加载中...</div>}
      <ul>
        {data?.list.map((item, index) => {
          // eslint-disable-next-line react/no-array-index-key
          return <li key={index}>{item.name}</li>;
        })}
      </ul>
      <Pagination {...paginationProps} />
    </div>
  );
};
