import axios, { AxiosRequestConfig } from 'axios';
import { UploadFile } from '@chaomingd/design';
import { uuid } from '@chaomingd/utils';
import React, { useState } from 'react';

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

const fuid = uuid();
export default () => {
  const [fileList, setFileList] = useState<any[]>([
    {
      uid: fuid,
      name: 'test.zip',
    },
  ]);
  return (
    <div>
      <UploadFile
        value={fileList}
        onChange={(fl) => {
          setFileList(fl);
        }}
        accepts={['zip', 'rar']}
        uploadRequest={uploadRequest}
      />
    </div>
  );
};
