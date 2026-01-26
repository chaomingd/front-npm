import { pxtorem } from '@chaomingd/utils'



const App = () => {
  const remValue1 = pxtorem(192); // 输出: "1.00000rem"
  const remValue2 = pxtorem(96); // 输出: "0.50000rem"
  const remValue3 = pxtorem(192, 2); // 输出: "1.00rem"
  const remValue4 = pxtorem(0); // 输出: undefined

  console.log(remValue1);
  console.log(remValue2);
  console.log(remValue3);
  console.log(remValue4);

  return (
    <div>在控制台查看</div>
  )
}
export default App
