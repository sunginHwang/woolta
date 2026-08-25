import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';
import { Todo, TodoCategory, TodoPriority, TodoViewMode } from '../types';

const createTodoId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getNextOrder = (items: { order: number }[]) =>
  items.length === 0 ? 0 : Math.max(...items.map((item) => item.order)) + 1;

interface AddTodoInput {
  /** 할 일 제목 */
  title: string;
  /** 마감일 (YYYY-MM-DD, 미정이면 null) */
  dueDate: string | null;
  /** 소속 카테고리 id (기본함이면 null) */
  categoryId: string | null;
  /** 우선순위 @default 'none' */
  priority?: TodoPriority;
}

export const useTodoStore = create(
  persist(
    combine(
      {
        todos: [] as Todo[],
        categories: [] as TodoCategory[],
        selectedTodoId: null as string | null,
        viewMode: 'list' as TodoViewMode,
        isDetailVisible: true,
      },
      (set, get) => ({
        addTodo: ({ title, dueDate, categoryId, priority = 'none' }: AddTodoInput) => {
          const { todos } = get();
          const now = new Date().toISOString();

          const todo: Todo = {
            id: createTodoId('todo'),
            title,
            memo: '',
            dueDate,
            categoryId,
            priority,
            isCompleted: false,
            completedAt: null,
            deletedAt: null,
            order: getNextOrder(todos),
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({ todos: [...state.todos, todo] }));
          return todo.id;
        },
        updateTodo: (
          id: string,
          patch: Partial<Pick<Todo, 'title' | 'memo' | 'dueDate' | 'categoryId' | 'priority'>>,
        ) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, ...patch, updatedAt: new Date().toISOString() } : todo,
            ),
          }));
        },
        toggleComplete: (id: string) => {
          const now = new Date().toISOString();
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    isCompleted: !todo.isCompleted,
                    completedAt: todo.isCompleted ? null : now,
                    updatedAt: now,
                  }
                : todo,
            ),
          }));
        },
        moveToTrash: (id: string) => {
          const now = new Date().toISOString();
          set((state) => ({
            todos: state.todos.map((todo) => (todo.id === id ? { ...todo, deletedAt: now, updatedAt: now } : todo)),
            selectedTodoId: state.selectedTodoId === id ? null : state.selectedTodoId,
          }));
        },
        restoreTodo: (id: string) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, deletedAt: null, updatedAt: new Date().toISOString() } : todo,
            ),
          }));
        },
        deleteForever: (id: string) => {
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
            selectedTodoId: state.selectedTodoId === id ? null : state.selectedTodoId,
          }));
        },
        emptyTrash: () => {
          set((state) => {
            const trashedIds = state.todos.filter((todo) => todo.deletedAt !== null).map((todo) => todo.id);
            return {
              todos: state.todos.filter((todo) => todo.deletedAt === null),
              selectedTodoId:
                state.selectedTodoId !== null && trashedIds.includes(state.selectedTodoId)
                  ? null
                  : state.selectedTodoId,
            };
          });
        },
        moveTodoToCategory: (id: string, categoryId: string | null) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, categoryId, updatedAt: new Date().toISOString() } : todo,
            ),
          }));
        },
        addCategory: (name: string) => {
          const category: TodoCategory = {
            id: createTodoId('category'),
            name,
            order: getNextOrder(get().categories),
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ categories: [...state.categories, category] }));
          return category.id;
        },
        updateCategory: (id: string, name: string) => {
          set((state) => ({
            categories: state.categories.map((category) => (category.id === id ? { ...category, name } : category)),
          }));
        },
        removeCategory: (id: string) => {
          set((state) => ({
            categories: state.categories.filter((category) => category.id !== id),
            todos: state.todos.map((todo) => (todo.categoryId === id ? { ...todo, categoryId: null } : todo)),
          }));
        },
        selectTodo: (id: string | null) => {
          // 할 일을 고르면 상세 패널이 닫혀 있어도 다시 열어준다.
          set({ selectedTodoId: id, isDetailVisible: true });
        },
        setViewMode: (viewMode: TodoViewMode) => {
          set({ viewMode });
        },
        setDetailVisible: (isDetailVisible: boolean) => {
          set({ isDetailVisible });
        },
        clearDetail: () => {
          set({ selectedTodoId: null, isDetailVisible: false });
        },
        toggleDetailVisible: () => {
          set((state) => ({ isDetailVisible: !state.isDetailVisible }));
        },
      }),
    ),
    { name: 'woolta:todos' },
  ),
);
