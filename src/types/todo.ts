export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}