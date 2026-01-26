import { useModel } from '@chaomingd/store';

interface State {
  value: string;
}

interface Effects {
  changeValue: (val: string) => void;
}

const Input = () => {
  const model = useModel<State, Effects>({
    state: {
      value: '',
    },
  });
  const { value } = model.useGetState();
  return (
    <div
      style={{
        color: '#000',
      }}
    >
      userName:
      <input
        value={value}
        onInput={(e) => {
          model.getEffect('changeValue')((e.target as HTMLInputElement).value);
        }}
      />
      <div>userName: {value}</div>
    </div>
  );
};

export default Input;
