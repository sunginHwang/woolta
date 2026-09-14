import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ALLOW_UNAUTHENTICATED, GraphqlFetchError } from '../utils/graphqlFetch';
import { useSessionExpiredRedirect } from './useSessionExpiredRedirect';

/**
 * 운영에서 실제로 터진 회귀를 막는다.
 *
 * blog 글 상세가 로그인 여부를 알려고 `me` 를 부르는데, 비로그인 방문자에게 서버는
 * UNAUTHENTICATED 를 준다. 이걸 세션 만료로 오인해 **공개 글을 보던 방문자가
 * 로그인 화면으로 튕겼다.** 미인증이 정상인 쿼리는 리다이렉트에서 빠져야 한다.
 */
const LOGIN_URL = 'https://example.test/login';

const unauthenticated = () =>
  new GraphqlFetchError('인증 토큰 정보가 존재하지 않습니다.', [
    { message: '인증 토큰 정보가 존재하지 않습니다.', extensions: { code: 'UNAUTHENTICATED' } },
  ]);

/** window.location.replace 를 가로채 호출 여부만 본다. */
const captureRedirect = () => {
  const calls: string[] = [];
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { replace: (url: string) => calls.push(url) },
  });
  return calls;
};

const renderWithQuery = (node: ReactNode) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{node}</QueryClientProvider>);
};

const Guard = () => {
  useSessionExpiredRedirect(LOGIN_URL);
  return null;
};

const FailingQuery = ({ meta }: { meta?: Record<string, unknown> }) => {
  useQuery({
    queryKey: ['probe', JSON.stringify(meta ?? null)],
    queryFn: () => Promise.reject(unauthenticated()),
    meta,
  });
  return null;
};

describe('useSessionExpiredRedirect 테스트', () => {
  it('ALLOW_UNAUTHENTICATED 가 달린 쿼리는 튕기지 않는다. (공개 화면의 me 조회)', async () => {
    // Given
    const calls = captureRedirect();

    // When
    renderWithQuery(
      <>
        <Guard />
        <FailingQuery meta={ALLOW_UNAUTHENTICATED} />
      </>,
    );

    // Then — 실패가 처리될 시간을 준 뒤에도 이동이 없어야 한다
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(calls).toEqual([]);
  });

  it('표시가 없는 쿼리가 UNAUTHENTICATED 로 실패하면 로그인으로 보낸다.', async () => {
    // Given
    const calls = captureRedirect();

    // When
    renderWithQuery(
      <>
        <Guard />
        <FailingQuery />
      </>,
    );

    // Then
    await waitFor(() => expect(calls).toEqual([LOGIN_URL]));
  });
});
