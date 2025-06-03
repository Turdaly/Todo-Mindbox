
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Checkbox } from './ui/checkbox';



interface TodoItemProps {
  todo: Types.Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={onToggle}
        className="flex-shrink-0"
      />
      <span
        className={`flex-1 ${
          todo.completed
            ? 'line-through text-gray-500'
            : 'text-gray-900'
        }`}
      >
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        aria-label="Удалить задачу"
        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};