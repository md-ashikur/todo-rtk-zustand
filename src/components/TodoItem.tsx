import { Todo } from '@/types/todo';
import { useToggleTodoMutation, useDeleteTodoMutation, useUpdateTodoMutation } from '@/features/todos/todosApi';
import { useTodoInputStore } from '@/zustand/useTodoStore';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiSave, FiX } from 'react-icons/fi';

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
      await updateTodo({ id: String(todo.id), title: editTitle });
      setEditingId(null);
    }
  }

  const handleCancel = () => {
    setEditingId(null);
    setEditTitle(todo.title);
  }

  return (
  <div>
    <li className="flex items-center justify-between bg-white shadow-md rounded-lg px-4 py-3 my-3">
      <div className="flex items-center space-x-4 w-full">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo({ id: String(todo.id), completed: !todo.completed })}
          className="accent-red-500 w-5 h-5 cursor-pointer"
          title={todo.completed ? 'Mark as active' : 'Mark as completed'}
        />
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {todo.completed ? 'Completed' : 'Active'}
        </span>
        <span className="text-gray-400 text-xs">#{todo.id}</span>
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
              className="border-b border-gray-300 focus:outline-none focus:border-blue-500 px-2 py-1 w-40 text-gray-900"
              placeholder="Edit todo..."
            />
            <button
              onClick={handleUpdate}
              disabled={!editTitle.trim()}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50"
              title="Save"
            >
              <FiSave /> <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded flex items-center gap-1"
              title="Cancel"
            >
              <FiX /> <span className="hidden sm:inline">Cancel</span>
            </button>
          </>
        ) : (
          <>
            <span
              className={todo.completed ? 'line-through decoration-red-500 decoration-4 text-gray-400' : 'text-gray-900'}
              style={{ marginRight: 8, minWidth: 100, display: 'inline-block' }}
            >
              {todo.title}
            </span>
            <button
              onClick={handleEdit}
              className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded flex items-center gap-1"
              title="Edit"
            >
              <FiEdit /> <span className="hidden sm:inline">Edit</span>
            </button>
          </>
        )}
      </div>
      <button
        onClick={() => deleteTodo(String(todo.id))}
        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 ml-4"
        title="Delete"
      >
        <FiTrash2 /> <span className="hidden sm:inline">Delete</span>
      </button>
    </li>
  </div>
  );
};

export default TodoItem;