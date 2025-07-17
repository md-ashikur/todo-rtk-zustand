import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Todo } from "@/types/todo";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/" }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos",
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: "todos",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Todos"],
    }),
    toggleTodo: builder.mutation<Todo, {id:number; completed: boolean}>({
      query: ({id, completed})=> ({
        url:`todos/${id}`,
        method: "PATCH",
        body: { completed },
      }),
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation<Todo, {id:number; title:string}>({
      query: ({id, title}) => ({
        url: `todos/${id}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    })
  }),
});


export const{
  useGetTodosQuery,
  useAddTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} = todosApi;
