import { loginRedirect } from '@chaomingd/utils';
import { history } from '@umijs/max';
import React from 'react';

function loginRequest() {
  return Promise.resolve({
    ok: true,
    token: 'xxxx',
  });
}
export default () => {
  return (
    <div>
      <button
        onClick={() => {
          loginRequest().then((res) => {
            if (res.ok) {
              // 登录成功
              loginRedirect({
                homePath: '/',
                history,
                access_token: res.token,
                replace: true,
              });
            }
          });
        }}
      >
        登录
      </button>
    </div>
  );
};
