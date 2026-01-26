import { Model } from '@chaomingd/store';

// 状态1
interface FishState {
  fishes: number;
}
class FishStore extends Model<FishState> {
  constructor(public store: Store) {
    super({
      state: {
        fishes: 0,
      },
    });
  }

  addFish() {
    this.setState({
      fishes: this.getState().fishes + 1,
    });
  }

  eatFish() {
    this.setState({
      fishes: this.getState().fishes - 1,
    });
  }
}

// 状态2
interface BearState {
  bears: number;
}
class BearStore extends Model<BearState> {
  constructor(public store: Store) {
    super({
      state: {
        bears: 0,
      },
    });
  }

  addBear() {
    this.setState({
      bears: this.getState().bears + 1,
    });
  }
}

// 合并store
class Store {
  fishStore: FishStore;
  bearStore: BearStore;
  constructor() {
    this.fishStore = new FishStore(this);
    this.bearStore = new BearStore(this);
  }
}

const store = new Store();

const Bear = () => {
  const { bears } = store.bearStore.useGetState();
  return (
    <div>
      <h2>Number of bears: {bears}</h2>
      <button onClick={() => store.bearStore.addBear()}>Add Bear</button>
    </div>
  );
};

const Fishi = () => {
  const { fishes } = store.fishStore.useGetState();
  return (
    <div>
      <h2>Number of fishes: {fishes}</h2>
      <button onClick={() => store.fishStore.addFish()}>Add Fish</button>
    </div>
  );
};
// 组件中使用
function App() {
  return (
    <div
      style={{
        color: '#000',
      }}
    >
      <Bear />
      <Fishi />
    </div>
  );
}

export default App;
