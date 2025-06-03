import { apiCall } from "./api";

const API_BASE_URL = "https://fb28766746d314d5.mokky.dev/todos";

export const todoApi = {
  async getTodos(): Promise<Types.Todo[]> {
    return await apiCall<Types.Todo[]>("/todos");
  },

  async createTodo(text: string): Promise<Types.Todo> {
    return await apiCall<Types.Todo>("/todos", {
      method: "POST",
      json: {
        text,
        completed: false,
      },
    });
  },

  async updateTodo(
    id: number,
    updates: Partial<Pick<Types.Todo, "text" | "completed">>
  ): Promise<Types.Todo> {
    return await apiCall<Types.Todo>(`/todos/${id}`, {
      method: "PATCH",
      json: updates,
    });
  },

  async deleteTodo(id: number): Promise<void> {
    return await apiCall<void>(`/todos/${id}`, {
      method: "DELETE",
    });
  },
};
