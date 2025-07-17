
import { useGetTodosQuery } from '@/features/todos/todosApi';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useGetTodosQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <div>
    {/* <div className='flex space-x-5 items-center'>
        <p>Status</p>
        <p>ID</p>
        <p>Title</p>
    </div> */}
        <ul>
      {todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
    </div>
  );
};

export default TodoList;