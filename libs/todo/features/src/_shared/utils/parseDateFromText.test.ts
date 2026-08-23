import { parseDateTokens } from './parseDateFromText';

// 기준일: 2026-08-22 (토요일)
const BASE_DATE = '2026-08-22';

describe('parseDateTokens 테스트', () => {
  it('"오늘" 토큰을 기준일로 해석한다.', () => {
    // Given
    const text = '오늘 회의 준비';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then
    expect(results).toHaveLength(1);
    expect(results[0].date).toBe('2026-08-22');
    expect(results[0].token).toEqual({ text: '오늘', startIndex: 0, endIndex: 2 });
  });

  it('"내일"과 "모레"를 기준일 +1일, +2일로 해석한다.', () => {
    // Given
    const tomorrowText = '내일 운동';
    const dayAfterText = '모레 검진';

    // When
    const tomorrowResults = parseDateTokens(tomorrowText, BASE_DATE);
    const dayAfterResults = parseDateTokens(dayAfterText, BASE_DATE);

    // Then
    expect(tomorrowResults[0].date).toBe('2026-08-23');
    expect(dayAfterResults[0].date).toBe('2026-08-24');
  });

  it('문장 중간의 토큰도 위치와 함께 찾는다.', () => {
    // Given
    const text = '회의 준비 내일 오전';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then
    expect(results[0].token.startIndex).toBe(6);
    expect(results[0].token.endIndex).toBe(8);
  });

  it('단어 일부인 경우 매칭하지 않는다. (예: 오늘의집)', () => {
    // Given
    const text = '오늘의집 구경하기';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then
    expect(results).toHaveLength(0);
  });

  it('요일 단독 표현은 다가오는 해당 요일로 해석한다. (지난 요일이면 다음 주)', () => {
    // Given — 기준일은 토요일
    const upcomingText = '일요일 대청소';
    const passedText = '수요일 회의';

    // When
    const upcomingResults = parseDateTokens(upcomingText, BASE_DATE);
    const passedResults = parseDateTokens(passedText, BASE_DATE);

    // Then — 일요일은 내일(8/23), 수요일은 다음 주(8/26)
    expect(upcomingResults[0].date).toBe('2026-08-23');
    expect(passedResults[0].date).toBe('2026-08-26');
  });

  it('"다음주 X요일"은 다음 주의 해당 요일로 해석한다.', () => {
    // Given
    const text = '다음주 금요일 발표';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then — 다음 주 월요일(8/24) 기준 금요일은 8/28
    expect(results[0].date).toBe('2026-08-28');
    expect(results[0].token.text).toBe('다음주 금요일');
  });

  it('"다음주" 단독 표현은 다음 주 월요일로 해석한다.', () => {
    // Given
    const text = '다음주 여행 준비';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then
    expect(results[0].date).toBe('2026-08-24');
  });

  it('"M월 D일" 표현을 올해 날짜로 해석하고, 지난 날짜면 내년으로 넘긴다.', () => {
    // Given
    const futureText = '9월 1일 개학';
    const passedText = '3월 2일 기념일';

    // When
    const futureResults = parseDateTokens(futureText, BASE_DATE);
    const passedResults = parseDateTokens(passedText, BASE_DATE);

    // Then
    expect(futureResults[0].date).toBe('2026-09-01');
    expect(passedResults[0].date).toBe('2027-03-02');
  });

  it('"YYYY-MM-DD"와 "M/D" 표현을 해석한다.', () => {
    // Given
    const isoText = '2026-12-25 크리스마스';
    const slashText = '9/15 점검';

    // When
    const isoResults = parseDateTokens(isoText, BASE_DATE);
    const slashResults = parseDateTokens(slashText, BASE_DATE);

    // Then
    expect(isoResults[0].date).toBe('2026-12-25');
    expect(slashResults[0].date).toBe('2026-09-15');
  });

  it('유효하지 않은 날짜는 매칭하지 않는다. (예: 13월 40일)', () => {
    // Given
    const text = '13월 40일 테스트';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then
    expect(results).toHaveLength(0);
  });

  it('토큰이 여러 개면 등장 순서대로 모두 반환한다.', () => {
    // Given
    const text = '내일 준비하고 9월 1일 제출';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then
    expect(results).toHaveLength(2);
    expect(results[0].token.text).toBe('내일');
    expect(results[1].token.text).toBe('9월 1일');
  });

  it('날짜 표현이 없으면 빈 배열을 반환한다.', () => {
    // Given
    const text = '장보기';

    // When
    const results = parseDateTokens(text, BASE_DATE);

    // Then
    expect(results).toHaveLength(0);
  });
});
