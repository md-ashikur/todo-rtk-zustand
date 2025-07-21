"use client";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  type Todo = {
    _id: string;
    title: string;
    completed: boolean;
    user?: User;
  };

  // Extend session type to include role
  const { data: session, status } = useSession() as { data: (Session & { user: User }) | null, status: string };
  const [users, setUsers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      Promise.all([
        fetch("/api/admin/users").then(res => res.json()),
        fetch("/api/admin/todos").then(res => res.json())
      ]).then(([usersData, todosData]) => {
        setUsers(usersData);
        setTodos(todosData);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  if (status === "loading" || loading) return <div className="mt-20 text-center">Loading...</div>;
  if (!isAdmin) return <div className="mt-20 text-center text-red-500">Access denied. Admins only.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Todos</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Title</th>
              <th className="p-2">Completed</th>
              <th className="p-2">User</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id} className="border-t">
                <td className="p-2">{todo.title}</td>
                <td className="p-2">{todo.completed ? "Yes" : "No"}</td>
                <td className="p-2">{todo.user?.email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
