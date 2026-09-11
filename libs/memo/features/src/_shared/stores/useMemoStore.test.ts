import { useMemoStore } from './useMemoStore';

describe('useMemoStore 테스트', () => {
  beforeEach(() => {
    useMemoStore.setState({ selectedMemoId: null });
  });

  describe('selectMemo 테스트', () => {
    it('selectMemo 를 호출하면 selectedMemoId 가 해당 id 로 변경된다.', () => {
      // Given
      // When
      useMemoStore.getState().selectMemo('memo-1');

      // Then
      expect(useMemoStore.getState().selectedMemoId).toBe('memo-1');
    });

    it('selectMemo 에 null 을 넘기면 선택이 해제된다.', () => {
      // Given
      useMemoStore.setState({ selectedMemoId: 'memo-1' });

      // When
      useMemoStore.getState().selectMemo(null);

      // Then
      expect(useMemoStore.getState().selectedMemoId).toBeNull();
    });
  });
});
