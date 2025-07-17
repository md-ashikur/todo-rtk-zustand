'use client';

import TodoList from '@/components/TodoList';
import { useAddTodoMutation } from '@/features/todos/todosApi';
import { useTodoInputStore } from '@/zustand/useTodoStore';

export default function Home() {
  const { input, setInput, reset } = useTodoInputStore();
  const [addTodo, { isLoading }] = useAddTodoMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addTodo({ title: input, completed: false });
    reset();
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Todo List</h1>
      <form className='flex space-x-5 items-center' onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
          className='border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500'
        />
        <button className='bg-blue-500 text-white px-2 py-1 rounded' type="submit" disabled={isLoading || !input.trim()}>
          Add
        </button>
      </form>
      <TodoList />
    </main>
  );
}