import { useTodoStore } from './useTodoStore';

describe('useTodoStore 테스트', () => {
  beforeEach(() => {
    useTodoStore.setState({ selectedTodoId: null, viewMode: 'list', isDetailVisible: true });
  });

  describe('selectTodo 테스트', () => {
    it('selectTodo 를 호출하면 해당 id 가 선택되고 상세 패널이 열린다.', () => {
      // Given
      useTodoStore.setState({ isDetailVisible: false });

      // When
      useTodoStore.getState().selectTodo('todo-1');

      // Then
      const { selectedTodoId, isDetailVisible } = useTodoStore.getState();
      expect(selectedTodoId).toBe('todo-1');
      expect(isDetailVisible).toBe(true);
    });
  });

  describe('clearDetail 테스트', () => {
    it('clearDetail 을 호출하면 선택만 해제되고 패널은 열린 채로 남는다.', () => {
      // Given
      useTodoStore.setState({ selectedTodoId: 'todo-1', isDetailVisible: true });

      // When
      useTodoStore.getState().clearDetail();

      // Then
      const { selectedTodoId, isDetailVisible } = useTodoStore.getState();
      expect(selectedTodoId).toBeNull();
      expect(isDetailVisible).toBe(true);
    });
  });

  describe('toggleDetailVisible 테스트', () => {
    it('toggleDetailVisible 을 호출하면 상세 패널 표시 여부가 뒤집힌다.', () => {
      // Given
      useTodoStore.setState({ isDetailVisible: true });

      // When
      useTodoStore.getState().toggleDetailVisible();

      // Then
      expect(useTodoStore.getState().isDetailVisible).toBe(false);
    });
  });

  describe('setViewMode 테스트', () => {
    it('setViewMode 로 칸반을 지정하면 viewMode 가 kanban 이 된다.', () => {
      // Given
      // When
      useTodoStore.getState().setViewMode('kanban');

      // Then
      expect(useTodoStore.getState().viewMode).toBe('kanban');
    });
  });
});
