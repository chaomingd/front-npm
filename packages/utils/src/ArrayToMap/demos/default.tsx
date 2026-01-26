import { arrayToMap } from '@chaomingd/utils'



const App = () => {
  const arr = ['a', 'b', 'c'];

  const map = arrayToMap(arr);

  console.log(map);
  return (
    <div>在控制台查看</div>
  )
}
export default App
