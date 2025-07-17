import { Todo } from '@/types/todo';
import { useToggleTodoMutation, useDeleteTodoMutation, useUpdateTodoMutation } from '@/features/todos/todosApi';
import { useTodoInputStore } from '@/zustand/useTodoStore';
import { useState } from 'react';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [toggleTodo] = useToggleTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  const {editingId, setEditingId} = useTodoInputStore();
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleEdit = () => {
    setEditTitle(todo.title);
    setEditingId(todo.id);
  }

  const handleUpdate = async () => {
    if(editTitle.trim() && editTitle !== todo.title) {
      await updateTodo({ id: todo.id, title: editTitle });
      setEditingId(null);
    }
  }

  const handleCancel = () => {
    setEditingId(null);
    setEditTitle(todo.title);
  }

  return (
   <div>
     <li className='flex space-x-5 items-center my-4'>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo({ id: todo.id, completed: !todo.completed })}
      />
      {editingId === todo.id ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdate();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
          />
          <button onClick={handleUpdate} disabled={!editTitle.trim()} className='bg-blue-500 text-white px-2 py-1 rounded'>
            Save
          </button>
          <button onClick={handleCancel} className='bg-gray-300 text-black px-2 py-1 rounded'>Cancel</button>
        </>
      ) : (
        <div className='space-x-5'>
        <span>{todo.id}</span>
          <span
            style={{ textDecoration: todo.completed ? 'line-through' : 'none', marginRight: 8 }}
          >
            {todo.title}
          </span>
          <button onClick={handleEdit} style={{ marginRight: 8 }} className='bg-yellow-500 text-white px-2 py-1 rounded'>
            Edit
          </button>
        </div>
      )}
      <button onClick={() => deleteTodo(todo.id)} className='bg-red-500 text-white px-2 py-1 rounded'>Delete</button>
    </li>
   </div>
  );
};

export default TodoItem;