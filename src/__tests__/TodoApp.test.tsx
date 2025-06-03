import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from '@/components/TodoApp';
import { useTodos } from '@/hooks/useTodos';

jest.mock('@/hooks/useTodos', () => ({
  useTodos: jest.fn(),
}));

const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;

describe('TodoApp', () => {
  const mockAddTodo = jest.fn();
  const mockToggleTodo = jest.fn();
  const mockDeleteTodo = jest.fn();
  const mockClearCompleted = jest.fn();

  const mockTodos: Types.Todo[] = [
    { id: 1, text: 'Active task', completed: false },
    { id: 2, text: 'Completed task', completed: true },
    { id: 3, text: 'Another active task', completed: false },
  ];

  const defaultHookReturn = {
    todos: mockTodos,
    activeTodos: mockTodos.filter(t => !t.completed),
    completedTodos: mockTodos.filter(t => t.completed),
    loading: false,
    addTodo: mockAddTodo,
    toggleTodo: mockToggleTodo,
    deleteTodo: mockDeleteTodo,
    clearCompleted: mockClearCompleted,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodos.mockReturnValue(defaultHookReturn);
  });

  it('renders loading state', () => {
    mockUseTodos.mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    render(<TodoApp />);

    expect(screen.getByText('Загружаем ваши задачи...')).toBeInTheDocument();
  });

  it('renders app title', () => {
    render(<TodoApp />);

    expect(screen.getByText('Список дел')).toBeInTheDocument();
  });

  it('renders todo input component', () => {
    render(<TodoApp />);

    expect(screen.getByPlaceholderText('Добавить новую задачу...')).toBeInTheDocument();
  });

  it('renders filter components', () => {
    render(<TodoApp />);

    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Активные')).toBeInTheDocument();
    expect(screen.getByText('Выполненные')).toBeInTheDocument();
  });

  it('renders todo list with all todos by default', () => {
    render(<TodoApp />);

    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.getByText('Completed task')).toBeInTheDocument();
    expect(screen.getByText('Another active task')).toBeInTheDocument();
  });

  it('renders todo stats', () => {
    render(<TodoApp />);

    expect(screen.getByText(/активные/i)).toBeInTheDocument();
  });

  it('filters todos to show only active when active filter is selected', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByText('Активные'));

    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.getByText('Another active task')).toBeInTheDocument();
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
  });

  it('filters todos to show only completed when completed filter is selected', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByText('Выполненные'));

    expect(screen.getByText('Completed task')).toBeInTheDocument();
    expect(screen.queryByText('Active task')).not.toBeInTheDocument();
    expect(screen.queryByText('Another active task')).not.toBeInTheDocument();
  });

  it('shows all todos when all filter is selected', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByText('Активные'));

    await user.click(screen.getByText('Все'));

    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.getByText('Completed task')).toBeInTheDocument();
    expect(screen.getByText('Another active task')).toBeInTheDocument();
  });

  it('adds new todo when input is submitted', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('Добавить новую задачу...');
    await user.type(input, 'New test task');
    await user.click(screen.getByRole('button', { name: /добавить задачу/i }));

    expect(mockAddTodo).toHaveBeenCalledWith('New test task');
  });

  it('toggles todo when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(mockToggleTodo).toHaveBeenCalledWith(1);
  });

  it('deletes todo when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const deleteButtons = screen.getAllByRole('button', { name: /удалить задачу/i });
    await user.click(deleteButtons[0]);

    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });

  it('shows clear completed button when there are completed todos', () => {
    render(<TodoApp />);

    expect(screen.getByText('Очистить выполненные')).toBeInTheDocument();
  });

  it('hides clear completed button when there are no completed todos', () => {
    mockUseTodos.mockReturnValue({
      ...defaultHookReturn,
      todos: mockTodos.filter(t => !t.completed),
      completedTodos: [],
    });

    render(<TodoApp />);

    expect(screen.queryByText('Очистить выполненные')).not.toBeInTheDocument();
  });

  it('clears completed todos when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const clearButton = screen.getByText('Очистить выполненные');
    await user.click(clearButton);

    expect(mockClearCompleted).toHaveBeenCalledTimes(1);
  });

  it('handles empty todo list', () => {
    mockUseTodos.mockReturnValue({
      ...defaultHookReturn,
      todos: [],
      activeTodos: [],
      completedTodos: [],
    });

    render(<TodoApp />);

    expect(screen.getByText('Нет задач для отображения')).toBeInTheDocument();
  });

  it('maintains filter state correctly', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    await user.click(screen.getByText('Активные'));

    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText('Добавить новую задачу...');
    await user.type(input, 'New active task');
    await user.click(screen.getByRole('button', { name: /добавить задачу/i }));

    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
  });
});