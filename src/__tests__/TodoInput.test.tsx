import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '@/components/TodoInput';

describe('TodoInput', () => {
  const mockOnAddTodo = jest.fn();

  beforeEach(() => {
    mockOnAddTodo.mockClear();
  });

  it('renders input field with correct placeholder', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    expect(screen.getByPlaceholderText('Добавить новую задачу...')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onAddTodo when form is submitted with valid input', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('Добавить новую задачу...');
    const form = input.closest('form');

    await user.type(input, 'Новая задача');
    fireEvent.submit(form!);

    expect(mockOnAddTodo).toHaveBeenCalledWith('Новая задача');
  });

  it('calls onAddTodo when clicking submit button with valid input', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('Добавить новую задачу...');
    const button = screen.getByRole('button');

    await user.type(input, 'Новая задача');
    await user.click(button);

    expect(mockOnAddTodo).toHaveBeenCalledWith('Новая задача');
  });

  it('clears input after submitting', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('Добавить новую задачу...') as HTMLInputElement;
    const form = input.closest('form');

    await user.type(input, 'Новая задача');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('does not call onAddTodo with empty input', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });

  it('does not call onAddTodo with whitespace-only input', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('Добавить новую задачу...');
    const form = input.closest('form');

    await user.type(input, '   ');
    fireEvent.submit(form!);

    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });

  it('trims whitespace from input before calling onAddTodo', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('Добавить новую задачу...');
    const form = input.closest('form');

    await user.type(input, '  Задача с пробелами  ');
    fireEvent.submit(form!);

    expect(mockOnAddTodo).toHaveBeenCalledWith('  Задача с пробелами  ');
  });

  it('disables submit button when input is empty', () => {
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('enables submit button when input has text', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('Добавить новую задачу...');
    const button = screen.getByRole('button');

    await user.type(input, 'Новая задача');

    expect(button).not.toBeDisabled();
  });
});