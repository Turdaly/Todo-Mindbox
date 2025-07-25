# Todo App - Mindbox Frontend Стажировка

Современное Todo приложение, разработанное с использованием TypeScript и React для стажировки в Mindbox.

## Описание проекта

Это полнофункциональное приложение для управления задачами с следующими возможностями:

- ✅ Добавление новых задач
- ✅ Отметка задач как выполненных/невыполненных
- ✅ Удаление отдельных задач
- ✅ Фильтрация задач (все/активные/выполненные)
- ✅ Счетчик оставшихся активных задач
- ✅ Очистка всех выполненных задач
- ✅ Адаптивный дизайн
- ✅ Полное покрытие тестами

## Технологии

- **React 18** с TypeScript
- **Next.js 15** - для серверного рендеринга и оптимизации
- **Tailwind CSS** - для стилизации
- **Radix UI** - доступные компоненты интерфейса
- **Jest & React Testing Library** - для тестирования
- **Lucide React** - иконки

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Запуск тестов
npm test

# Сборка для продакшена
npm run build
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
src/
├── components/          # React компоненты
│   ├── ui/             # Базовые UI компоненты
│   ├── TodoApp.tsx     # Главный компонент приложения
│   ├── TodoInput.tsx   # Компонент для ввода новых задач
│   ├── TodoList.tsx    # Список задач
│   ├── TodoItem.tsx    # Отдельная задача
│   ├── TodoFilters.tsx # Фильтры задач
│   └── TodoStats.tsx   # Статистика задач
├── hooks/              # Пользовательские хуки
│   └── useTodos.ts     # Логика управления задачами
├── types/              # TypeScript типы
└── __tests__/          # Тесты
```

## Особенности реализации

- **TypeScript** - строгая типизация для предотвращения ошибок
- **Компонентная архитектура** - модульная и переиспользуемая структура
- **Custom Hooks** - вынесение логики в отдельные хуки
- **Accessibility** - поддержка screen readers и навигации с клавиатуры
- **Responsive Design** - адаптация под разные размеры экранов
- **Comprehensive Testing** - покрытие всех основных функций тестами

## Требования к проекту

Проект полностью соответствует требованиям стажировки Mindbox:

- [x] Поле для ввода новой задачи
- [x] Список задач с тремя вариантами отображения
- [x] Счетчик количества невыполненных задач
- [x] Кнопка "Очистить выполненные"
- [x] Использование TypeScript и React Hooks
- [x] Возможность запуска через npm команды
- [x] Покрытие ключевого функционала тестами

## Тестирование

Проект включает полное покрытие тестами:

```bash
# Запуск всех тестов
npm test

# Запуск тестов в watch режиме
npm run test:watch

# Генерация отчета о покрытии
npm run test:coverage
```

## Автор

Создано для стажировки в Mindbox Frontend.
