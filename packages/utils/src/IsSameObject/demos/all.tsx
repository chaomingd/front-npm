import { isSameObject } from '@chaomingd/utils'

const App = () => {
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = { a: 1, b: 2, c: 3 };
  const obj3 = { a: 1, b: 2, c: 4 };

  // 比较所有键
  console.log(isSameObject(obj1, obj2)); // 输出: true
  console.log(isSameObject(obj1, obj3)); // 输出: false
  return (
    <div>在控制台查看</div>
  )
}

export default App
