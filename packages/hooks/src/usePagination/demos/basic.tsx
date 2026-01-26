import { Pagination } from 'antd';
import { usePagination } from '@chaomingd/hooks';

function getUserList(current: number, pageSize: number): Promise<{ total: number; list: number[] }> {
  const list: number[] = [];
  const start = (current - 1) * pageSize;
  const end = current * pageSize;
  for (let i = start; i < end; i++) {
    list.push(i);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 100,
        list: list,
      });
    }, 500);
  })
}

export default () => {
  const { loading, data, paginationProps } = usePagination(
    (current, pageSize) => {
      return getUserList(current, pageSize).then(res => {
        return {
          ...res,
          test: ''
        }
      });
    },
  );
  return (
      <div>
        {loading && <div>加载中...</div>}
        <ul>
          {data?.list.map((n) => {
            return <li key={n}>{n}</li>;
          })}
        </ul>
        <Pagination {...paginationProps} />
      </div>
  );
};
