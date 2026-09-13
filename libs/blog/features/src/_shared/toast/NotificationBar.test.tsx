import { act, render, screen } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import NotificationBar from './NotificationBar';
import { toastMessageAtom } from './store';

/**
 * 원본(apps/blog)에도 스냅샷 테스트가 있었지만 atom 기본값이 빈 문자열이라
 * 항상 `<div />` 만 찍혔다 — 표시 동작을 전혀 검증하지 못했다.
 * 옮기면서 실제 노출/숨김/갱신을 확인하도록 고쳤다.
 */
const renderWithStore = (message: string) => {
  const store = createStore();
  store.set(toastMessageAtom, message);

  const utils = render(
    <Provider store={store}>
      <NotificationBar />
    </Provider>,
  );

  return { ...utils, store };
};

describe('NotificationBar 테스트', () => {
  it('토스트 메시지가 있으면 그 내용을 보여준다.', () => {
    // Given
    // When
    renderWithStore('저장이 완료되었습니다.');

    // Then
    expect(screen.queryByText('저장이 완료되었습니다.')).not.toBeNull();
  });

  it('메시지가 비어 있으면 아무것도 렌더하지 않는다.', () => {
    // Given
    // When
    const { container } = renderWithStore('');

    // Then
    expect(container.innerHTML).toBe('');
  });

  it('메시지가 바뀌면 바뀐 내용으로 갱신된다.', () => {
    // Given
    const { store } = renderWithStore('첫 번째');

    // When
    act(() => store.set(toastMessageAtom, '두 번째'));

    // Then
    expect(screen.queryByText('두 번째')).not.toBeNull();
    expect(screen.queryByText('첫 번째')).toBeNull();
  });
});
