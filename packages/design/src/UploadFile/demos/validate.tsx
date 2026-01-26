import axios, { AxiosRequestConfig } from 'axios';
import React from 'react';
import { UploadFile } from '@chaomingd/design';

// 模拟接口请求
function uploadRequest(formData: FormData, options: AxiosRequestConfig) {
  return axios({
    method: 'POST',
    url: '/api/upload',
    data: formData,
    ...options,
  }).then((res) => {
    return res.data.url; // 返回字符串 或 返回 { url: string }  url 会自动添加到 fileList.url 中
  });
}

export default () => {
  return (
    <div>
      <UploadFile validation={{
        validateRequest({ axiosRequestConfig, onError, onProgress, onSuccess, fileItem }) {
          let progress = 0;
          const timer = setInterval(() => {
            progress += 0.1;
            onProgress(progress);
            if (progress >= 1) {
              clearInterval(timer);
              onSuccess();
            }
          }, 300)

          // 模拟请求
          // ...
        },
      }} accepts={['zip', 'rar']} uploadRequest={uploadRequest} />
    </div>
  );
};
