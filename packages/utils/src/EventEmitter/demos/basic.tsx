import { EventEmitter } from '@chaomingd/utils'



const App = () => {
  // 创建事件发射器实例
const emitter = new EventEmitter<string>();

// 添加事件监听器
const unsubscribe = emitter.on('eventName', (arg1: number, arg2: string) => {
  console.log(`Event triggered with ${arg1} and ${arg2}`);
});

// 触发事件
emitter.emit('eventName', 42, 'hello');

// 移除事件监听器
unsubscribe();

// 只触发一次的事件监听器
emitter.once('onceEvent', (arg) => {
  console.log(`This will be logged only once with ${arg}`);
});
emitter.emit('onceEvent', 'one-time');

// 移除特定事件的所有监听器
emitter.offAllListeners();

  return (
    <div>在控制台查看</div>
  )
}
export default App
