import { formatDateGroupLabel, formatDueDate } from './formatDueDate';

const BASE_DATE = '2026-08-22';

describe('formatDueDate 테스트', () => {
  it('기준일 당일은 "오늘" 라벨을 반환한다.', () => {
    // Given / When
    const result = formatDueDate('2026-08-22', BASE_DATE);

    // Then
    expect(result).toEqual({ label: '오늘', isOverdue: false });
  });

  it('기준일 다음 날은 "내일" 라벨을 반환한다.', () => {
    // Given / When
    const result = formatDueDate('2026-08-23', BASE_DATE);

    // Then
    expect(result).toEqual({ label: '내일', isOverdue: false });
  });

  it('같은 해의 날짜는 "M월 D일" 형식으로 반환한다.', () => {
    // Given / When
    const result = formatDueDate('2026-09-01', BASE_DATE);

    // Then
    expect(result).toEqual({ label: '9월 1일', isOverdue: false });
  });

  it('지난 날짜는 지연 여부를 true로 반환한다.', () => {
    // Given / When
    const result = formatDueDate('2026-08-20', BASE_DATE);

    // Then
    expect(result).toEqual({ label: '8월 20일', isOverdue: true });
  });

  it('다른 해의 날짜는 연도를 포함해 반환한다.', () => {
    // Given / When
    const result = formatDueDate('2027-01-01', BASE_DATE);

    // Then
    expect(result).toEqual({ label: '2027년 1월 1일', isOverdue: false });
  });
});

describe('formatDateGroupLabel 테스트', () => {
  it('내일은 내일 표기와 날짜/요일을 함께 반환한다.', () => {
    // Given / When
    const label = formatDateGroupLabel('2026-08-23', BASE_DATE);

    // Then — 2026-08-23 은 일요일
    expect(label).toBe('내일 ‧ 8월 23일 (일)');
  });

  it('같은 해의 다른 날짜는 날짜와 요일만 반환한다.', () => {
    // Given / When
    const label = formatDateGroupLabel('2026-08-26', BASE_DATE);

    // Then — 2026-08-26 은 수요일
    expect(label).toBe('8월 26일 (수)');
  });

  it('다른 해의 날짜는 연도를 포함해 반환한다.', () => {
    // Given / When
    const label = formatDateGroupLabel('2027-01-01', BASE_DATE);

    // Then — 2027-01-01 은 금요일
    expect(label).toBe('2027년 1월 1일 (금)');
  });
});
