import { Form } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';
import { UploadFile } from '@chaomingd/design';
import React from 'react';

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
      <Form
        layout="vertical"
        onValuesChange={(_, values) => {
          console.log(values);
        }}
      >
        <Form.Item label="上传算法文件" name="fileList">
          <UploadFile accepts={['zip', 'rar']} uploadRequest={uploadRequest} />
        </Form.Item>
      </Form>
    </div>
  );
};
