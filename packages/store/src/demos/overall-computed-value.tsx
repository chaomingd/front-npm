import { Model } from '@chaomingd/store';

type StoreType = {
  count: number;
  countSq: number;
};

class Store extends Model<StoreType> {
  constructor() {
    super({
      state: {
        count: 0,
        countSq: 0,
      },
      computed: [
        {
          keys: ['count'],
          hander: ({ count }) => {
            return {
              countSq: count ** 2,
            };
          },
        },
      ],
    });
  }
}

const store = new Store();

export default function App() {
  const { count, countSq } = store.useGetState(['count', 'countSq']);
  return (
    <div
      style={{
        color: '#000',
      }}
    >
      <button onClick={() => store.setState({ count: count + 1 })}>+</button>
      <button onClick={() => store.setState({ count: count - 1 })}>-</button>
      <div>count: {count}</div>
      <div>countSq: {countSq}</div>
    </div>
  );
}
