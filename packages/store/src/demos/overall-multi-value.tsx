import { Model } from '@chaomingd/store';

type State = {
  firstName: string;
  lastName: string;
};



// 2. 继承Model
class PersonStore extends Model<State> {
  constructor() {
    super({
      state: {
        firstName: '',
        lastName: '',
      },
    });
  }

  updateFirstName(firstName: string) {
    this.setState({
      firstName,
    });
  }

  updateLastName(lastName: string) {
    this.setState({
      lastName,
    });
  }
}

const personStore = new PersonStore();

// In consuming app
export default function App() {
  // useGetState 传入一个数组，数组的元素是需要监听的 state 的 key
  // 只有当监听的 key的值 发生变化时，组件才会重新渲染
  const { firstName } = personStore.useGetState([
    'firstName',
    'lastName',
  ]);
  return (
    <main
      style={{
        color: '#000',
      }}
    >
      <label>
        First name
        <input
          // Update the "firstName" state
          onChange={(e) => personStore.updateFirstName(e.currentTarget.value)}
          value={firstName}
        />
      </label>

      <p>
        Hello, <strong>{firstName}!</strong>
      </p>
    </main>
  );
}
