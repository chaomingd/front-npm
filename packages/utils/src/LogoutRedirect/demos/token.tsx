// 当前地址 http://www.xxx.com/task/create
import { logoutRedirect } from '@chaomingd/utils';
import { history } from '@umijs/max';
logoutRedirect({
  loginPath: 'http://www.cm.com/login',
  history,
  withToken: true,
});
// 跳转到 http://www.cm.com/login?redirect=http://www.xxx.com/task/create&withToke=true
