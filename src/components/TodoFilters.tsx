import { Button } from '@/components/ui/button';

interface TodoFiltersProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
}

export const TodoFilters = ({
  currentFilter,
  onFilterChange,
  hasCompletedTodos,
  onClearCompleted
}: TodoFiltersProps) => {
  const filters = [
    { key: 'all' as const, label: 'Все' },
    { key: 'active' as const, label: 'Активные' },
    { key: 'completed' as const, label: 'Выполненные' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex gap-1">
        {filters.map(filter => (
          <Button
            key={filter.key}
            variant={currentFilter === filter.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {hasCompletedTodos && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCompleted}
          className="text-red-600 hover:text-red-700"
        >
          Очистить выполненные
        </Button>
      )}
    </div>
  );
};