import { useModel } from '@chaomingd/store';
import React, { useMemo } from 'react';

interface State {
  value: string;
}

interface Effects {
  changeValue: (val: string) => void;
}

interface InputProps {
  value?: string;
  onChange?: (val: string) => void;
}
const Input = (props: InputProps) => {
  const hasValue = 'value' in props;

  const model = useModel<State, Effects>({
    state: {
      value: '',
    },
    effects: {
      changeValue: (val: string) => {
        model.setState(
          {
            value: val,
          },
          {
            silent: hasValue,
          },
        );

        props.onChange?.(val);
      },
    },
  });

  useMemo(() => {
    // 加上silent: true, 从而仅更新状态而不重新渲染组件
    if (hasValue) {
      model.setState(
        {
          value: props.value,
        },
        {
          silent: true,
        },
      );
    }
  }, [props.value]);

  const { value } = model.useGetState();
  return (
    <input
      value={value}
      onInput={(e) => {
        model.getEffect('changeValue')((e.target as HTMLInputElement).value);
      }}
    />
  );
};

export default () => {
  const [value, setValue] = React.useState('');
  return (
    <div
      style={{
        color: '#000',
      }}
    >
      <div>
        受控组件：
        <Input value={value} onChange={(val) => setValue(val)} />
      </div>
      <div>
        非受控组件：
        <Input />
      </div>
    </div>
  );
};
