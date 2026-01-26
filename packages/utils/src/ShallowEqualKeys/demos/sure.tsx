import { shallowEqualKeys } from '@chaomingd/utils'



const App = () => {
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = { a: 1, b: 2, c: 4 };

  // 比较指定的键
  console.log(shallowEqualKeys(obj1, obj2, ['a', 'b'])); // 输出: true
  console.log(shallowEqualKeys(obj1, obj2, ['a', 'c'])); // 输出: false
  return (
    <div>在控制台查看</div>
  )
}
export default App
