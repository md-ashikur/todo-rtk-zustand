'use client';

import TodoList from '@/components/TodoList';
import { useAddTodoMutation } from '@/features/todos/todosApi';
import { useTodoInputStore } from '@/zustand/useTodoStore';
import { FiPlus, FiLoader } from 'react-icons/fi';

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center justify-center gap-2">
          <FiPlus className="text-blue-500" /> Todo List
        </h1>
        <form
          className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center mb-6"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 text-lg text-gray-600 shadow-sm"
          />
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <FiLoader className="animate-spin" /> : <FiPlus />}
            <span>Add</span>
          </button>
        </form>
        <TodoList />
      </div>
    </main>
  );
}