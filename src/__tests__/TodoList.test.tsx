import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '@/components/TodoList';

describe('TodoList', () => {
  const mockOnToggleTodo = jest.fn();
  const mockOnDeleteTodo = jest.fn();

  const mockTodos: Types.Todo[] = [
    {
      id: 1,
      text: 'First task',
      completed: false,
    },
    {
      id: 2,
      text: 'Second task',
      completed: true,
    },
    {
      id: 3,
      text: 'Third task',
      completed: false,
    },
  ];

  beforeEach(() => {
    mockOnToggleTodo.mockClear();
    mockOnDeleteTodo.mockClear();
  });

  it('renders empty state when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByText('Нет задач для отображения')).toBeInTheDocument();
  });

  it('renders list of todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
  });

  it('renders correct number of todo items', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('calls onToggleTodo with correct id when todo is toggled', async () => {
    const user = userEvent.setup();
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);

    expect(mockOnToggleTodo).toHaveBeenCalledWith(1);
  });

  it('calls onDeleteTodo with correct id when todo is deleted', async () => {
    const user = userEvent.setup();
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const deleteButtons = screen.getAllByRole('button');
    await user.click(deleteButtons[0]);

    expect(mockOnDeleteTodo).toHaveBeenCalledWith(1);
  });

  it('renders todos with correct completion status', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked(); 
  });

  it('handles single todo correctly', () => {
    const singleTodo = [mockTodos[0]];

    render(
      <TodoList
        todos={singleTodo}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});