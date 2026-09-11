'use client';

import { useUpsertShareCodeMutation } from '../api/gql.generated';
import { useShareCodeCache } from './useShareCode';

/**
 * 공유코드를 발급하거나 재발급한다.
 *
 * 레거시 REST 는 `GET /auth/share-code`(조회)와 `POST /auth/share-code`(발급)로 나뉘어 있었다.
 * GraphQL 에서는 조회가 `getShareCode` 쿼리, 발급이 이 뮤테이션이다.
 */
export const useUpsertShareCode = () => {
  const { invalidateShareCode } = useShareCodeCache();

  const { mutateAsync, isPending } = useUpsertShareCodeMutation({
    onSuccess: () => invalidateShareCode(),
  });

  return {
    upsertShareCode: (): Promise<string> => mutateAsync({}).then((data) => data.upsertShareCode),
    isUpserting: isPending,
  };
};
