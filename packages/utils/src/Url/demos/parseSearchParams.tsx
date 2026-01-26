import { parseSearchParams } from '@chaomingd/utils';
const APP = () => {

  const queryString = 'name=value&key=val1&key=val2';
  const params = parseSearchParams(queryString);

  console.log(params);

  return  <div>打开控制台查看效果</div>
}

export default APP;
