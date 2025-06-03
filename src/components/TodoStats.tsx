interface TodoStatsProps {
  activeCount: number;
  completedCount: number;
}

export const TodoStats = ({ activeCount, completedCount }: TodoStatsProps) => {
  const totalCount = activeCount + completedCount;

  return (
    <div className="text-sm text-gray-600 text-center">
      <p>
        Всего: {totalCount} | Активных: {activeCount} | Выполнено: {completedCount}
      </p>
    </div>
  );
};
