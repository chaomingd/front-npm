import { searchParamsToString } from '@chaomingd/utils';
const APP = () => {

  const params = { name: 'value', key: ['val1', 'val2'] };
  const queryString = searchParamsToString(params);

  console.log(queryString);
  return (
    <div>打开控制台查看效果</div>
  )
}

export default APP;
