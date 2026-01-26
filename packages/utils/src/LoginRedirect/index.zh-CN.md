---
nav: 工具
group:
  title: 通用
  order: 1
---

# 登录
改函数用于用户登录后跳转到首页或重定向到其它页面
跳转协议：

1. 如果当前页面有 redirect 参数 如 http://www.cm.com/login?redirect=/task/create
   则调用 loginRedirect 函数将会跳转到 /task/create 页面
2. redirect 参数也可以是外部连接 如 http://www.cm.com/login?redirect=http://www.xxx.com/task/create
3. 如果当前页面没有 redirect 参数
   则调用 loginRedirect 将会跳转到 指定的 homePath 页面
4. 登录如果使用的是 cookie，则 access_token 传入空字符串 access_token:'' ，即可。

## 目前有两种登录方式

### token 方式

主题组件中，内置了处理 access_token 的逻辑：gateway() (src/utils/gateway)。
将 url 中的 access_token 信息存储在 localStorage 中,命名为 loginData ；并 history replace 消除 url 中的 access_token 信息。

### cookie 方式

## 基本使用

<code src="./demos/cookie.tsx"></code>


## 跳转到外部地址并带上 token

跳转到行为是由当前的 url 决定的 参考[logoutRedirect](/utils/logout-redirect)
如果当前 url 是: http://www.cm.com/login?redirect=http://www.xxx.com&withToken=true

则调用 loginRedirect 会跳转到 http://www.xxx.com?&access_token=${access_token}&token_type=${token_type}

withToken 参数会带上登录时的 token 值到 redirect 指定的页面

<code src="./demos/token.tsx"></code>

## API

```ts | pure
function loginRedirect(option: {
  homePath: string;
  access_token: string;
  token_type?: string;
  history: {
    push: (...args: any[]) => any;
    replace: (...args: any[]) => any;
  };
  replace?: boolean;
}): void;
```

| 参数         | 描述                                                                            | 类型    | 必填 | 默认值 |
| ------------ | ------------------------------------------------------------------------------- | ------- | ---- | ------ |
| homePath     | 登录有默认跳转的地址，如果当前 url 有 redirect 参数则跳转到 redirect 指定的页面 | string  | 是   |        |
| access_token | token 值                                                                        | string  | 是   |        |
| token_type   | JSON WEB TOKEN 的 类型                                                          | string  | 否   | Bearer |
| history      | h5 history api，在项目中使用 import {history} from '@umi/max'                   |         | 是   |        |
| replace      | 跳转时是否替换当前页面的浏览记录 （效果跟 history.pushState 一样）              | boolean |      |        |
