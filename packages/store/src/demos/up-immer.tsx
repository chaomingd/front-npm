import { Model } from '@chaomingd/store';
import { useCreation } from 'ahooks';
import { produce } from 'immer';

interface TodoItem {
  id: string;
  text: string;
}
interface TodoState {
  todos: TodoItem[];
}

class TodoStore extends Model<TodoState> {
  constructor() {
    super({
      state: {
        todos: [],
      },
    });
  }

  addTodo() {
    this.setState(
      produce(this.getState(), (state) => {
        state.todos.push({
          id: Math.random().toString(36).slice(2),
          text: 'new todo',
        });
      }),
    );
  }
  removeTodo(id: string) {
    this.setState(
      produce(this.getState(), (state) => {
        state.todos = state.todos.filter((todo) => todo.id !== id);
      }),
    );
  }
  editTodo(id: string, text: string) {
    this.setState(
      produce(this.getState(), (state) => {
        const todo = state.todos.find((t) => t.id === id);
        if (todo) {
          todo.text = text;
        }
      }),
    );
  }
}
export default () => {
  const model = useCreation(() => {
    return new TodoStore();
  }, []);
  const { todos } = model.useGetState();
  return (
    <div
      style={{
        color: '#000',
      }}
    >
      <button onClick={() => model.addTodo()}>add todo</button>
      {todos.map((todo) => (
        <div key={todo.id}>
          <input
            value={todo.text}
            onInput={(e) => {
              model.editTodo(todo.id, (e.target as HTMLInputElement).value);
            }}
          />
          <button onClick={() => model.removeTodo(todo.id)}>remove</button>
        </div>
      ))}
    </div>
  );
};
