
import { useGetTodosQuery } from '@/features/todos/todosApi';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useGetTodosQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-8">
    
      <div className="border-b border-gray-200 mb-4" />
      {todos && todos.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-400 py-8 text-lg">
          No todos yet. Add your first task!
        </div>
      )}
    </div>
  );
};

export default TodoList;