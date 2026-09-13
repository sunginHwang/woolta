import { GraphqlFetchError, isUnauthenticatedError } from './graphqlFetch';

/**
 * 이 판별이 틀리면 대가가 양쪽으로 크다 —
 * 너무 넓으면 멀쩡한 사용자를 로그아웃시키고, 너무 좁으면 만료가 "데이터 없음"으로 보인다.
 */
describe('isUnauthenticatedError 테스트', () => {
  it('extensions.code 가 UNAUTHENTICATED 면 참이다.', () => {
    // Given
    const error = new GraphqlFetchError('인증 토큰 정보가 존재하지 않습니다.', [
      { message: '인증 토큰 정보가 존재하지 않습니다.', extensions: { code: 'UNAUTHENTICATED' } },
    ]);

    // When
    // Then
    expect(isUnauthenticatedError(error)).toBe(true);
  });

  it('status 가 401 이면 errors 가 비어도 참이다. (REST 라우트 응답)', () => {
    // Given
    const error = new GraphqlFetchError('실패', [], 401);

    // When
    // Then
    expect(isUnauthenticatedError(error)).toBe(true);
  });

  it('FORBIDDEN 은 거짓이다. — 로그인은 돼 있고 권한만 없는 상태라 재로그인 대상이 아니다.', () => {
    // Given
    const error = new GraphqlFetchError('권한이 없습니다.', [
      { message: '권한이 없습니다.', extensions: { code: 'FORBIDDEN' } },
    ]);

    // When
    // Then
    expect(isUnauthenticatedError(error)).toBe(false);
  });

  it('서버 내부 오류는 거짓이다. — 이걸 참으로 보면 장애 때 전원이 로그아웃된다.', () => {
    // Given
    const error = new GraphqlFetchError('_.chain is not a function', [
      { message: '_.chain is not a function', extensions: { code: 'INTERNAL_SERVER_ERROR' } },
    ]);

    // When
    // Then
    expect(isUnauthenticatedError(error)).toBe(false);
  });

  it('GraphqlFetchError 가 아니면 거짓이다. (네트워크 단절 등)', () => {
    // Given
    // When
    // Then
    expect(isUnauthenticatedError(new TypeError('Failed to fetch'))).toBe(false);
    expect(isUnauthenticatedError(null)).toBe(false);
    expect(isUnauthenticatedError(undefined)).toBe(false);
  });

  it('errors 중 하나라도 UNAUTHENTICATED 면 참이다.', () => {
    // Given
    const error = new GraphqlFetchError('부분 실패', [
      { message: '무언가', extensions: { code: 'BAD_REQUEST' } },
      { message: '만료', extensions: { code: 'UNAUTHENTICATED' } },
    ]);

    // When
    // Then
    expect(isUnauthenticatedError(error)).toBe(true);
  });
});
