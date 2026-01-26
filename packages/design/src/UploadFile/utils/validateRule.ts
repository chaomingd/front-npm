
export function getValidateRule() {
  return {
    validator: (_: any, val: any[]) => {
      if (Array.isArray(val)) {
        let valid = true;
        let message = '';
        for (let i = 0; i < val.length; i++) {
          const item = val[i]
          if (item.status === 'error') {
            valid = false;
            message = '文件上传失败';
            break;
          }
        }
        if (!valid) {
          return Promise.reject(new Error(message))
        }
      }
      return Promise.resolve()
    }
  };
}
