import { parseUrl } from '@chaomingd/utils';
const APP = () => {

const url = 'https://user:password@www.example.com:8080/path?name=value#hash';
const parsedUrl = parseUrl(url);

console.log(parsedUrl);
  return (
    <div>打开控制台查看效果</div>
  )
}

export default APP;
