import { arrayToMap } from '@chaomingd/utils'



const App = () => {
  const arr = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];

  const map = arrayToMap(arr, item => item.id);

  console.log(map);
  return (
    <div>在控制台查看</div>
  )
}
export default App
