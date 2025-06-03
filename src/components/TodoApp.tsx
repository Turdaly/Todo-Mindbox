'use'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodos } from '@/hooks/useTodos';
import { useState } from 'react';
import { TodoInput } from './TodoInput';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';
import { TodoStats } from './TodoStats';
export const TodoApp = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const {
    todos,
    activeTodos,
    completedTodos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted
  } = useTodos();

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return activeTodos;
      case 'completed':
        return completedTodos;
      default:
        return todos;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загружаем ваши задачи...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Список дел
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <TodoInput onAddTodo={addTodo} />

            <TodoFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              hasCompletedTodos={completedTodos.length > 0}
              onClearCompleted={clearCompleted}
            />

            <TodoList
              todos={getFilteredTodos()}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
            />

            <TodoStats
              activeCount={activeTodos.length}
              completedCount={completedTodos.length}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};