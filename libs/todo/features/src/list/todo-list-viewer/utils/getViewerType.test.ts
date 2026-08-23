import { getViewerType } from './getViewerType';

describe('getViewerType 테스트', () => {
  it('미래 리스트면 뷰 모드와 무관하게 upcoming 을 반환한다.', () => {
    // Given / When / Then
    expect(getViewerType({ isUpcoming: true, isViewToggleVisible: false, viewMode: 'kanban' })).toBe('upcoming');
    expect(getViewerType({ isUpcoming: true, isViewToggleVisible: true, viewMode: 'list' })).toBe('upcoming');
  });

  it('뷰 전환이 불가능한 리스트(완료/휴지통)면 list 를 반환한다.', () => {
    // Given / When
    const viewerType = getViewerType({ isUpcoming: false, isViewToggleVisible: false, viewMode: 'kanban' });

    // Then
    expect(viewerType).toBe('list');
  });

  it('뷰 전환이 가능하면 선택된 뷰 모드를 그대로 따른다.', () => {
    // Given / When / Then
    expect(getViewerType({ isUpcoming: false, isViewToggleVisible: true, viewMode: 'kanban' })).toBe('kanban');
    expect(getViewerType({ isUpcoming: false, isViewToggleVisible: true, viewMode: 'list' })).toBe('list');
  });
});
