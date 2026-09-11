// 패키지 entry (workspace public API) — barrel 금지 규칙의 유일한 예외
export { prefetchMe, useMe, useMeCache, useMeOptional } from './_shared/hooks/useMe';
export {
  useLoginByShareCode,
  useLoginBySocial,
  useLogout,
  useRefreshSession,
} from './_shared/hooks/useSessionMutations';
export {
  prefetchShareCode,
  useShareCode,
  useShareCodeCache,
  useShareCodeOptional,
} from './_shared/hooks/useShareCode';
export { useUpsertShareCode } from './_shared/hooks/useShareCodeMutations';
export { isReadOnlySession, type SocialLoginType, type UserInfo } from './_shared/types';
