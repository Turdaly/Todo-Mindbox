import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilters } from '@/components/TodoFilters';

describe('TodoFilters', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnClearCompleted = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    mockOnClearCompleted.mockClear();
  });

  it('renders all filter buttons', () => {
    render(
      <TodoFilters
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Активные')).toBeInTheDocument();
    expect(screen.getByText('Выполненные')).toBeInTheDocument();
  });

  it('highlights current filter', () => {
    render(
      <TodoFilters
        currentFilter="active"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    const activeButton = screen.getByText('Активные');
    const allButton = screen.getByText('Все');

    expect(activeButton).toHaveClass('bg-primary');
    expect(allButton).not.toHaveClass('bg-primary');
  });

  it('calls onFilterChange when filter button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoFilters
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    const activeButton = screen.getByText('Активные');
    await user.click(activeButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('active');
  });

  it('shows clear completed button when hasCompletedTodos is true', () => {
    render(
      <TodoFilters
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={true}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText('Очистить выполненные')).toBeInTheDocument();
  });

  it('hides clear completed button when hasCompletedTodos is false', () => {
    render(
      <TodoFilters
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.queryByText('Очистить выполненные')).not.toBeInTheDocument();
  });

  it('calls onClearCompleted when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoFilters
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={true}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    const clearButton = screen.getByText('Очистить выполненные');
    await user.click(clearButton);

    expect(mockOnClearCompleted).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles to clear completed button', () => {
    render(
      <TodoFilters
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={true}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    const clearButton = screen.getByText('Очистить выполненные');
    expect(clearButton).toHaveClass('text-red-600');
  });

  it('handles all filter states correctly', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TodoFilters
        currentFilter="all"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText('Все')).toHaveClass('bg-primary');

    await user.click(screen.getByText('Выполненные'));
    expect(mockOnFilterChange).toHaveBeenCalledWith('completed');

    rerender(
      <TodoFilters
        currentFilter="completed"
        onFilterChange={mockOnFilterChange}
        hasCompletedTodos={true}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText('Выполненные')).toHaveClass('bg-primary');
  });
});