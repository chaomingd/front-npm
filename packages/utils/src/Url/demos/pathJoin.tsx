import { pathJoin } from '@chaomingd/utils';
const APP = () => {

  const path1 = '/path/to';
  const path2 = 'directory/';
  const path3 = 'file';

  const fullPath = pathJoin(path1, path2, path3);

  console.log(fullPath);

  return (
    <div>打开控制台查看效果</div>
  )
}

export default APP;
