import { useLatestState } from '@chaomingd/hooks';
import { Button, message } from 'antd';

export default () => {
  const [state1, setState1, getRealState1] = useLatestState(1);
  const clickBtn1 = () => {
    setState1(state1 + 1);
    message.info(
      `读取 state1 值是 ${state1}，获取 getRealState1() 值是 ${getRealState1()}`,
    );
  };

  const [state2, setState2, getRealState2] = useLatestState(() => 10);
  const clickBtn2 = () => {
    setState2((pre) => {
      return pre + 2;
    });
    message.info(
      `读取 state2 值是 ${state2}，获取 getRealState2() 值是 ${getRealState2()}`,
    );
  };

  const [state3, setState3, getRealState3] = useLatestState(1);
  const clickBtn3 = () => {
    setState3((pre) => {
      return pre + 2;
    });
    console.log(
      `读取 state3 值是 ${state3}，获取 getRealState3() 值是 ${getRealState3()}`,
    );
    setState3((pre) => {
      return pre + 2;
    });
    console.log(
      `第二次读取 state3 值是 ${state3}，获取 getRealState3() 值是 ${getRealState3()}`,
    );
  };

  return (
    <div>
      <h4>初始化为值，设置状态参数为值情况</h4>
      <div>视图中的值 state1 ：{state1}</div>
      <Button
        type="primary"
        onClick={() => {
          clickBtn1();
        }}
      >
        加1
      </Button>

      <hr />

      <h4>初始化参数为函数，设置状态参数为函数情况</h4>
      <div>视图中的值 state2 ：{state2}</div>
      <Button
        type="primary"
        onClick={() => {
          clickBtn2();
        }}
      >
        加2
      </Button>

      <hr />
      <h4>状态参数为函数，且在批量更新的场景中也可以取到最新值</h4>
      <div>视图中的值 state3 ：{state3}</div>
      <Button
        type="primary"
        onClick={() => {
          clickBtn3();
        }}
      >
        加2
      </Button>
    </div>
  );
};
