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
      <UploadFile
        accepts={['zip', 'rar', 'txt', 'pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg']}
        uploadRequest={uploadRequest}
        maxCount={6}
        onChange={(fileList) => {
          console.log(fileList);
        }}
        multiple
        uploadConcurrency={2}
      />
    </div>
  );
};
