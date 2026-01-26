import { Pagination } from 'antd';
import { usePaginationWithListLayout } from '@chaomingd/hooks';
import { Grid } from '@chaomingd/design';
import { useRef } from 'react';

export default () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { items, col, paginationProps } = usePaginationWithListLayout(
    (current, pageSize) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const items: any[] = [];
      const start = (current - 1) * pageSize;
      const end = current * pageSize;
      for (let i = start; i < end; i++) {
        items.push(i);
      }
      return Promise.resolve({
        totalCount: 1000,
        items,
      });
    },
    {
      listLayoutConfig: {
        containerRef,
        baseWidth: 200,
        gap: 20,
        row: 5,
        /**
         * 默认px转换
         *
          if (window.innerWidth > 1920) {
            return Math.round((px / 1920) * window.innerWidth);
          }
          return px;
          项目中使用无需传 pxTransform
        */
        pxTransform: (n) => n,
      },
    },
  );
  return (
    <div
 >
      <div ref={containerRef}>
        <Pagination {...paginationProps} />
        <Grid col={col} gap={20} pxTransform={(n: number) => `${n}px`}>
          {items.map((item) => {
            return (
              <Grid.Item key={item}>
                <div
                  style={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  {item}
                </div>
              </Grid.Item>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};
