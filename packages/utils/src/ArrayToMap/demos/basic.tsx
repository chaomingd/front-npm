import { arrayToMap } from '@chaomingd/utils'


type Item = {
  id: string;
  name: string;
}

const App = () => {
  const arr: Item[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

// 转换为对象
const map = arrayToMap(arr, (item: Item) => item.id, (item: Item) => item.name);

console.log(map);
  return (
    <div>在控制台查看</div>
  )
}
export default App
