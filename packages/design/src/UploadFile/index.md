---
nav: 组件
group:
  title: 通用
  order: 6
---

# Upload

## 代码演示

### 基本用法
<code src="./demos/basic.tsx"></code>

### 与表单结合
<code src="./demos/withForm.tsx"></code>

### 受控模式
<code src="./demos/control.tsx"></code>


### 已上传列表
<code src="./demos/fileList.tsx"></code>

### 限制上传文件数量 
设置 maxCount 限制上传文件数量 默认为 1
<code src="./demos/maxCount.tsx"></code>


### 服务端校验文件
<code src="./demos/validate.tsx"></code>

### API
```tsx | pure
import { UploadFile } from 'antd'
import { AxiosRequestConfig } from 'axios'
import { ReactNode } from 'react'

// fileItem
export interface FileListItemProps extends UploadFile {
  file?: File;
  // 终止上传
  abort?: () => any;
  // 校验状态
  validationStatus?: 'validating' | 'success' | 'error';
  // 校验进度
  validationPercent?: number;
  // 校验错误
  validationError?: Error;
  // 终止校验
  validationAbort?: () => any;
}

// props
export interface UploadFileProps {
  // 上传文件的key
  name?: string;
  // 接受的文件类型 如： accepts: ['zip', 'rar']
  accepts?: string[];
  // 额外的数据 todo
  data?: Object;
  value?: FileListItemProps[];
  onChange?: (fileList: FileListItemProps[]) => any;
  // 上传前校验文件，返回 Promise，resolve 则校验成功，reject 校验失败则该文件不会上传，注意这个用法跟 antd Upload 组件不一样
  beforeUpload?: (file: File) => Promise<any>;
  // 自定义上传，跟 antd Upload的 customRequest 基本一致，但不建议使用
  // 可直接使用 uploadRequest 会更方便
  customRequest?: (options: {
    onProgress: (event: { percent: number }) => any;
    onError: (e: Error, body?: any) => any;
    onSuccess: (body: any) => any;
    file: File;
    fileItem: FileListItemProps;
    signal: AbortSignal;
  }) => { abort: () => any } | void;
  // 上传接口方法调用
  uploadRequest?: (
    formData: FormData,
    options: AxiosRequestConfig,
    fileItem: FileListItemProps
  ) => Promise<
    | string
    | {
        url?: string;
        [key: string]: any;
      }
  >;
  // 自定义渲染文件列表
  itemRender?: (options: {
    remove: (uid: string) => any;
    reUpload: (uid: string) => any;
  }) => ReactNode;
  // 最大文件数量 默认 1
  maxCount?: number;
  // 最大文件 大小 单位为 byte
  maxFileSize?: number;
  // 是否支持选中多个文件一起上传
  multiple?: boolean;
  // 是否启用拖拽上传
  dragable?: boolean;
  children?: ReactNode | ReactNode[];
  // 开启校验
  validation?: {
    validateRequest: (options: {
      onProgress: (percent: number) => void;
      onSuccess: () => void;
      onError: (e: Error) => void;
      axiosRequestConfig: AxiosRequestConfig;
      fileItem: FileListItemProps;
    }) => { abort: () => any } | undefined;
  };
}
```