---
nav: 工具
group:
  title: 通用
  order: 3
---

# 注销

该函数用于退出登录跳转到登录页面时带上当前地址，以便登陆时回到之前打开的页面 (跳转协议参考 [loginRedirect](/utils/login-redirect))

需要配合 loginRedirect 使用

使用时机

1. 点击退出登录按钮
2. token 过期，接口响应 401

## 基本使用

<code src="./demos/basic.tsx"></code>

## 跳转到外部地址加上 withToken 参数 参考[loginRedirect](/utils/login-redirect#跳转到外部地址并带上token)

<code src="./demos/token.tsx"></code>

## API

```tsx | pure
function logoutRedirect(config: {
  loginPath: string;
  history: {
    push: (...args: any[]) => any;
    replace: (...args: any[]) => any;
  };
  withToken?: boolean;
  replace?: boolean;
}): void;
```
