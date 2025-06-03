import { renderHook, act } from '@testing-library/react';
import { useTodos } from '@/hooks/useTodos';
import { todoApi } from '@/services/todoApi';

jest.mock('@/services/todoApi', () => ({
  todoApi: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}));

jest.mock('@/hooks/useToasts', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockTodoApi = todoApi as jest.Mocked<typeof todoApi>;

describe('useTodos', () => {
  const mockTodos: Types.Todo[] = [
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: true },
    { id: 3, text: 'Task 3', completed: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads todos on mount', async () => {
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);

    const { result } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockTodoApi.getTodos).toHaveBeenCalledTimes(1);
    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.loading).toBe(false);
  });

  it('calculates active and completed todos correctly', async () => {
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.activeTodos).toEqual([
      { id: 1, text: 'Task 1', completed: false },
      { id: 3, text: 'Task 3', completed: false },
    ]);
    expect(result.current.completedTodos).toEqual([
      { id: 2, text: 'Task 2', completed: true },
    ]);
  });

  it('adds a new todo', async () => {
    const newTodo: Types.Todo = { id: 4, text: 'New Task', completed: false };
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);
    mockTodoApi.createTodo.mockResolvedValue(newTodo);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.addTodo('New Task');
    });

    expect(mockTodoApi.createTodo).toHaveBeenCalledWith('New Task');
    expect(result.current.todos).toContain(newTodo);
  });

  it('does not add empty todo', async () => {
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.addTodo('   ');
    });

    expect(mockTodoApi.createTodo).not.toHaveBeenCalled();
  });

  it('toggles todo completion status', async () => {
    const updatedTodo: Types.Todo = { id: 1, text: 'Task 1', completed: true };
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);
    mockTodoApi.updateTodo.mockResolvedValue(updatedTodo);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.toggleTodo(1);
    });

    expect(mockTodoApi.updateTodo).toHaveBeenCalledWith(1, { completed: true });
    expect(result.current.todos.find(t => t.id === 1)?.completed).toBe(true);
  });

  it('deletes a todo', async () => {
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);
    mockTodoApi.deleteTodo.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.deleteTodo(1);
    });

    expect(mockTodoApi.deleteTodo).toHaveBeenCalledWith(1);
    expect(result.current.todos.find(t => t.id === 1)).toBeUndefined();
  });

  it('clears completed todos', async () => {
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);
    mockTodoApi.deleteTodo.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.clearCompleted();
    });

    expect(mockTodoApi.deleteTodo).toHaveBeenCalledWith(2);
    expect(result.current.todos.filter(t => t.completed)).toHaveLength(0);
  });

  it('handles loading error gracefully', async () => {
    mockTodoApi.getTodos.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.todos).toEqual([]);
  });

  it('handles add todo error gracefully', async () => {
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);
    mockTodoApi.createTodo.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const initialTodosLength = result.current.todos.length;

    await act(async () => {
      await result.current.addTodo('New Task');
    });

    expect(result.current.todos).toHaveLength(initialTodosLength);
  });

  it('handles toggle todo error gracefully', async () => {
    mockTodoApi.getTodos.mockResolvedValue(mockTodos);
    mockTodoApi.updateTodo.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const originalTodo = result.current.todos.find(t => t.id === 1);

    await act(async () => {
      await result.current.toggleTodo(1);
    });

    const updatedTodo = result.current.todos.find(t => t.id === 1);
    expect(updatedTodo?.completed).toBe(originalTodo?.completed);
  });
});