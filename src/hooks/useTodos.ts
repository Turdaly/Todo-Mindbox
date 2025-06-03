import { useState, useEffect } from 'react';
import { useToast } from './useToasts';
import { todoApi } from '@/services/todoApi';


export const useTodos = () => {
  const [todos, setTodos] = useState<Types.Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить задачи",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    if (text.trim() === '') return;

    try {
      const newTodo = await todoApi.createTodo(text.trim());
      setTodos(prev => [...prev, newTodo]);
      toast({
        title: "Задача добавлена",
        description: `"${text}" добавлена в список`,
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить задачу",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await todoApi.updateTodo(id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить задачу",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Задача удалена",
        description: "Задача успешно удалена",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить задачу",
        variant: "destructive",
      });
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => todoApi.deleteTodo(todo.id)));
      setTodos(prev => prev.filter(todo => !todo.completed));
      toast({
        title: "Выполненные задачи очищены",
        description: `Удалено ${completedTodos.length} задач(и)`,
      });
    } catch (error) {
      console.error('Error clearing completed todos:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось очистить выполненные задачи",
        variant: "destructive",
      });
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return {
    todos,
    activeTodos,
    completedTodos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
};