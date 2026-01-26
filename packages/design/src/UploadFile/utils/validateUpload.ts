import { FileListItemProps } from '../type';


export function validateUpload(fileItems: FileListItemProps[]) {
  let isValid = true
  let message = ''
  for (const fileItem of fileItems) {
    if (fileItem.status === 'uploading') {
      isValid = false
      message = `文件${fileItem.name}未上传完成`
      break
    }

    if (fileItem.validationStatus === 'validating') {
      isValid = false;
      message = `文件${fileItem.name}未校验完成`
      break
    }

    if (fileItem.validationStatus === 'error') {
      isValid = false
      message = `文件${fileItem.name}校验失败`
      break
    }
  }
  return {
    isValid,
    message,
  }
}
