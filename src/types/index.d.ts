declare global {
  namespace Types {
    interface Todo {
      id: number;
      text: string;
      completed: boolean;
    }
  }
}
export {}