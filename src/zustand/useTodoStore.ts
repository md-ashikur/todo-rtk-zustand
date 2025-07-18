import { create } from 'zustand';

interface TodoInputState {
  input: string;
  setInput: (value: string) => void;
  reset: () => void;
  editingId: number | null; 
  setEditingId: (id: number | null) => void; 
}

export const useTodoInputStore = create<TodoInputState>((set) => ({
  input: '',
  setInput: (value) => set({ input: value }),
  reset: () => set({ input: '' }),
  editingId: null,
  setEditingId: (id) => set({ editingId: id }),
}));


interface User {
  _id: string;
  name: string;
  email: string;
}
interface UserStore {
  users: User[];
  fetchUsers: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  fetchUsers: async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    set({ users: data });
  },
}));

