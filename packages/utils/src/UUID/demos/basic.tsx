import { uuid ,shortUUID} from '@chaomingd/utils'



const App = () => {
  const uniqueId = uuid(); // 生成标准格式 UUID，例如 "e3b0c442-98fc-1c14-9d6f-9d5b5a89e7d8"
  const shortId = shortUUID(); // 生成短格式 UUID，例如 "e3b0c44298fc"

  console.log('uniqueId', uniqueId)
  console.log('shortId', shortId)

  return (
    <div>在控制台查看</div>
  )
}
export default App
