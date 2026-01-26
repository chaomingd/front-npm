---
nav: Hooks
group:
  title: 分页
  order: 2
---

# usePaginationWithListLayout

列表分页布局，基于usePagination 封装，主要用于 卡片列表布局，自动响应式

## 代码演示

### 基础用法
调整浏览器窗口，自动更新 列数，和 pageSize
<code src="./demos/basic.tsx"></code>

## API

parmas 参数请参考 [usePagination](/hooks/use-pagination)

listConfigLayout

```tsx | pure
import {MutableRefObject} from 'react'
interface IState {
  col: number;
  row: number;
}
interface LisLayoutConfig {
  containerRef?: MutableRefObject<HTMLElement | null>;
  baseWidth: number;
  baseHeight?: number;
  gap?: number | [number, number];
  onChange?: (state: IState) => any;
  pxTransform?: (base: number, width: number) => number;
}
```


| 参数名       | 类型                                    | 必填 | 描述                                                                          | 默认值             |
| -------------- | ----------------------------------------- | ------ | ------------------------------------------------------------------------------- | -------------------- |
| containerRef | React.MutableRefObject`<HMTLELement>`   | 否   | 默认监听window的宽度，如果传了containerRef 则监听其dom元素的宽度              | 无                 |
| baseWidth    | 卡片宽度 number                         | 是   | 设置 baseWidth，自动计算需要的最小列数                                        | 无                 |
| baseHeight   | 卡片高度 number                         | 否   | 自动计算需要的最小行数                                                        | 无                 |
| gap          | number\| number[]                       | 否   | 列表间隔                                                                      | 无                 |
| onChange     | (state: IState) => any                  | 否   | 列表 col, row 发生改变时触发                                                  | 无                 |
| pxTransform  | (base: number, width: number) => number | 否   | 为适配不同屏幕，可传入 pxTransform 转换，baseWidth, baseHeight, gap的实际数值 | fe-npm/utils/px.ts |
