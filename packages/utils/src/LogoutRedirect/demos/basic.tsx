import { logoutRedirect } from '@chaomingd/utils';
import { history } from '@umijs/max';

// 当前 url: http://www.cm.com/task/create
export default () => {
  return (
    <button
      onClick={() => {
        logoutRedirect({
          loginPath: '/login',
          history,
        });

        // 跳转时会带上 redirect=http://www.cm.com/task/create
      }}
    >
      退出登录
    </button>
  );
};
