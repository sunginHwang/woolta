import { Todo, TodoCategory } from '../types';
import { useTodoStore } from './useTodoStore';

const baseTodo: Todo = {
  id: 'todo-1',
  title: '기본 할 일',
  memo: '',
  dueDate: null,
  categoryId: null,
  priority: 'none',
  isCompleted: false,
  completedAt: null,
  deletedAt: null,
  order: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const baseCategory: TodoCategory = {
  id: 'category-1',
  name: '업무',
  order: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('useTodoStore 테스트', () => {
  beforeEach(() => {
    useTodoStore.setState({
      todos: [],
      categories: [],
      selectedTodoId: null,
      viewMode: 'list',
      isDetailVisible: true,
    });
  });

  it('addTodo 호출 시 할 일이 추가되고 id를 반환한다.', () => {
    // Given
    const { addTodo } = useTodoStore.getState();

    // When
    const todoId = addTodo({ title: '새 할 일', dueDate: '2026-03-01', categoryId: null });

    // Then
    const { todos } = useTodoStore.getState();
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe(todoId);
    expect(todos[0].title).toBe('새 할 일');
    expect(todos[0].dueDate).toBe('2026-03-01');
  });

  it('addTodo 는 전달받은 마감일과 카테고리를 그대로 반영한다.', () => {
    // Given
    const { addTodo } = useTodoStore.getState();

    // When
    addTodo({ title: '업무 할 일', dueDate: null, categoryId: 'category-1' });

    // Then
    const [todo] = useTodoStore.getState().todos;
    expect(todo.dueDate).toBeNull();
    expect(todo.categoryId).toBe('category-1');
  });

  it('toggleComplete 호출 시 완료 상태와 완료 시각이 토글된다.', () => {
    // Given
    useTodoStore.setState({ todos: [{ ...baseTodo }] });

    // When
    useTodoStore.getState().toggleComplete('todo-1');

    // Then
    const completedTodo = useTodoStore.getState().todos[0];
    expect(completedTodo.isCompleted).toBe(true);
    expect(completedTodo.completedAt).not.toBeNull();

    // When
    useTodoStore.getState().toggleComplete('todo-1');

    // Then
    const restoredTodo = useTodoStore.getState().todos[0];
    expect(restoredTodo.isCompleted).toBe(false);
    expect(restoredTodo.completedAt).toBeNull();
  });

  it('moveToTrash 호출 시 deletedAt이 설정되고 선택이 해제된다.', () => {
    // Given
    useTodoStore.setState({ todos: [{ ...baseTodo }], selectedTodoId: 'todo-1' });

    // When
    useTodoStore.getState().moveToTrash('todo-1');

    // Then
    const { todos, selectedTodoId } = useTodoStore.getState();
    expect(todos[0].deletedAt).not.toBeNull();
    expect(selectedTodoId).toBeNull();
  });

  it('restoreTodo 호출 시 deletedAt이 해제된다.', () => {
    // Given
    useTodoStore.setState({ todos: [{ ...baseTodo, deletedAt: '2026-01-02T00:00:00.000Z' }] });

    // When
    useTodoStore.getState().restoreTodo('todo-1');

    // Then
    expect(useTodoStore.getState().todos[0].deletedAt).toBeNull();
  });

  it('emptyTrash 호출 시 휴지통 항목만 모두 제거된다.', () => {
    // Given
    useTodoStore.setState({
      todos: [
        { ...baseTodo, id: 'todo-1', deletedAt: '2026-01-02T00:00:00.000Z' },
        { ...baseTodo, id: 'todo-2' },
      ],
    });

    // When
    useTodoStore.getState().emptyTrash();

    // Then
    const { todos } = useTodoStore.getState();
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe('todo-2');
  });

  it('removeCategory 호출 시 소속 할 일은 기본함으로 이동한다.', () => {
    // Given
    useTodoStore.setState({
      categories: [{ ...baseCategory }],
      todos: [{ ...baseTodo, categoryId: 'category-1' }],
    });

    // When
    useTodoStore.getState().removeCategory('category-1');

    // Then
    const { categories, todos } = useTodoStore.getState();
    expect(categories).toHaveLength(0);
    expect(todos[0].categoryId).toBeNull();
  });

  it('moveTodoToCategory 호출 시 카테고리가 변경된다.', () => {
    // Given
    useTodoStore.setState({ todos: [{ ...baseTodo }] });

    // When
    useTodoStore.getState().moveTodoToCategory('todo-1', 'category-1');

    // Then
    expect(useTodoStore.getState().todos[0].categoryId).toBe('category-1');
  });

  it('selectTodo 호출 시 닫혀 있던 상세 패널이 다시 열린다.', () => {
    // Given
    useTodoStore.setState({ todos: [{ ...baseTodo }], isDetailVisible: false });

    // When
    useTodoStore.getState().selectTodo('todo-1');

    // Then
    const { selectedTodoId, isDetailVisible } = useTodoStore.getState();
    expect(selectedTodoId).toBe('todo-1');
    expect(isDetailVisible).toBe(true);
  });

  it('setDetailVisible 로 상세 패널 표시 여부를 지정한다.', () => {
    // Given
    const { setDetailVisible } = useTodoStore.getState();

    // When
    setDetailVisible(false);

    // Then
    expect(useTodoStore.getState().isDetailVisible).toBe(false);
  });

  it('toggleDetailVisible 호출 시 상세 패널 표시 여부가 반전된다.', () => {
    // Given
    useTodoStore.setState({ isDetailVisible: true });

    // When
    useTodoStore.getState().toggleDetailVisible();

    // Then
    expect(useTodoStore.getState().isDetailVisible).toBe(false);

    // When
    useTodoStore.getState().toggleDetailVisible();

    // Then
    expect(useTodoStore.getState().isDetailVisible).toBe(true);
  });
});
