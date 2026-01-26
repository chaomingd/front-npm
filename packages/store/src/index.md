# Store

## 作为全局状态

### 基本使用

<code src="./demos/overall-basic.tsx"></code>
:::info
modelInstance.setState： 用来更新状态值，只需传入部分状态值，自动合并，功能类似 class 组件的 setState
</br>
modelInstance.getState： 用来获取最新的状态值，与 react 渲染时机无关，任何时候获取的都是最新的值
:::

### 多个状态组合

<code src="./demos/overall-multi-state.tsx"></code>

### 取出多个值

<code src="./demos/overall-multi-value.tsx"></code>

### Computed 计算值

<code src="./demos/overall-computed-value.tsx"></code>

## 作为局部状态

### 基本使用

#### 配合 useCreation 的自定义 hook 使用，

:::info
useCreation 自定义 hook 的核心原理 (初始化一次)

```tsx | pure
import { useRef } from 'react';
function useCreation<Fn extends (...args: any[]) => any>(fn: Fn) {
  const resRef = useRef<ReturnType<Fn>>();
  if (!resRef.current) {
    resRef.current = fn();
  }

  return resRef.current;
}
```

这里为例方便直接使用 ahooks 中的 useCreation，内部原理基本和上面的一致
:::

<code src="./demos/part-basic.tsx"></code>

#### 使用自定义工具 hook，useModel

<code src="./demos/part-custom-hook.tsx"></code>
:::info
useModel 实际上就是对上述例子中 useCreation 和 实例化 Model 过程的封装
:::

### 组件的受控于非受控模式

受控模式是指组件的状态由用户控制，一般通过 props 传入值控制 UI 的显示，非受控模式是指，组件的状态由组件内部管理，外部无法更改。
一般来说对于基础组件，既要支持受控模式，也要支持非受控模式。下面以 Input 组件为例
<code src="./demos/part-mode.tsx"></code>

### 配合 Context 使用

<code src="./demos/part-context.tsx"></code>

## 进阶用法

### 处理请求竞态问题

竞态问题指的是，当我们在交互过程中，由于各种原因导致同一个接口短时间之内连续发送请求，后发送的请求有可能先得到请求结果，从而导致数据渲染出现预期之外的错误。
最典型的场景是输入框搜索功能，容易引发竞态问题，如下面的例子
<code src="./demos/part-question.tsx"></code>

#### 使用 AsyncManger 处理请求竞态问题

<code src="./demos/part-resolve-question.tsx"></code>
:::info

```bash | pure
asyncManager(name: string, options: {
  loadingKey?: string;
  config?: {
    retryCount?: number;
    retryInterval?: number;
  }
}).exec(fn)
name: 唯一标识，不重复即可
options:
- loadingKey: loading状态的key值
- config:
  - retryCount: fn 方法出错是重试的次数
  - retryInterval 重试的时间间隔(ms)，默认 300ms
```

:::

### 处理请求重试

<code src="./demos/up-request-retry.tsx"></code>

### immer 状态更新

配合 immer.js 更新状态
<code src="./demos/up-immer.tsx"></code>
