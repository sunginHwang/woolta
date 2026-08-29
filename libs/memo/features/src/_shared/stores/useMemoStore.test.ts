import type { Memo } from '../types';
import { EMPTY_MEMO_CONTENT, useMemoStore } from './useMemoStore';

const baseItem: Memo = {
  id: 'memo-1',
  title: '기본 메모',
  content: EMPTY_MEMO_CONTENT,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
};

describe('useMemoStore 테스트', () => {
  beforeEach(() => {
    useMemoStore.setState({ memos: [], selectedMemoId: null });
  });

  describe('createMemo 테스트', () => {
    it('createMemo 를 호출하면 빈 메모가 목록 맨 앞에 추가되고 해당 메모가 선택된다.', () => {
      // Given
      useMemoStore.setState({ memos: [baseItem], selectedMemoId: null });

      // When
      const createdId = useMemoStore.getState().createMemo();

      // Then
      const { memos, selectedMemoId } = useMemoStore.getState();
      expect(memos).toHaveLength(2);
      expect(memos[0].id).toBe(createdId);
      expect(memos[0].title).toBe('');
      expect(memos[0].createdAt).toBe(memos[0].updatedAt);
      expect(selectedMemoId).toBe(createdId);
    });
  });

  describe('updateMemo 테스트', () => {
    it('updateMemo 로 제목을 변경하면 제목과 updatedAt 이 갱신된다.', () => {
      // Given
      useMemoStore.setState({ memos: [baseItem], selectedMemoId: baseItem.id });

      // When
      useMemoStore.getState().updateMemo(baseItem.id, { title: '변경된 제목' });

      // Then
      const updated = useMemoStore.getState().memos[0];
      expect(updated.title).toBe('변경된 제목');
      expect(updated.updatedAt).not.toBe(baseItem.updatedAt);
      expect(updated.createdAt).toBe(baseItem.createdAt);
    });

    it('updateMemo 에 존재하지 않는 id 를 넘기면 목록이 변하지 않는다.', () => {
      // Given
      useMemoStore.setState({ memos: [baseItem], selectedMemoId: null });

      // When
      useMemoStore.getState().updateMemo('unknown-id', { title: '변경' });

      // Then
      expect(useMemoStore.getState().memos).toEqual([baseItem]);
    });
  });

  describe('removeMemo 테스트', () => {
    it('removeMemo 로 선택된 메모를 삭제하면 목록에서 제거되고 선택이 해제된다.', () => {
      // Given
      useMemoStore.setState({ memos: [baseItem], selectedMemoId: baseItem.id });

      // When
      useMemoStore.getState().removeMemo(baseItem.id);

      // Then
      const { memos, selectedMemoId } = useMemoStore.getState();
      expect(memos).toHaveLength(0);
      expect(selectedMemoId).toBeNull();
    });

    it('removeMemo 로 선택되지 않은 메모를 삭제하면 기존 선택은 유지된다.', () => {
      // Given
      const otherItem = { ...baseItem, id: 'memo-2', title: '다른 메모' };
      useMemoStore.setState({ memos: [baseItem, otherItem], selectedMemoId: baseItem.id });

      // When
      useMemoStore.getState().removeMemo(otherItem.id);

      // Then
      const { memos, selectedMemoId } = useMemoStore.getState();
      expect(memos).toEqual([baseItem]);
      expect(selectedMemoId).toBe(baseItem.id);
    });
  });

  describe('selectMemo 테스트', () => {
    it('selectMemo 를 호출하면 selectedMemoId 가 해당 id 로 변경된다.', () => {
      // Given
      useMemoStore.setState({ memos: [baseItem], selectedMemoId: null });

      // When
      useMemoStore.getState().selectMemo(baseItem.id);

      // Then
      expect(useMemoStore.getState().selectedMemoId).toBe(baseItem.id);
    });
  });
});
