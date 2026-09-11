'use client';

import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCreateAccountBookListMutation } from '../../_shared/api/gql.generated';
import { getAccountBookListQueryKey } from '../../_shared/hooks/accountBookListApi';
import { useToast } from '../../_shared/toast/useToast';
import type { BulkDraftRow } from './useBulkUploadDraft';

/**
 * 카드 내역서 벌크 등록.
 * 서버가 단일 트랜잭션으로 처리하므로 전부 들어가거나 전부 안 들어간다.
 */
export const useCreateAccountBookBulk = () => {
  const { onToast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useCreateAccountBookListMutation({
    onSuccess: ({ createAccountBookList }, { input }) => {
      /**
       * 등록된 내역이 걸친 달의 목록 캐시를 모두 무효화한다.
       * 가계부 목록 쿼리는 달 단위라, 두 달치를 올리면 두 키가 낡는다.
       */
      const months = new Set(input.itemList.map((item) => dayjs(item.registerDateTime as string).format('YYYY-MM')));
      months.forEach((month) => {
        queryClient.invalidateQueries({ queryKey: getAccountBookListQueryKey(`${month}-01`) });
      });

      onToast(`${createAccountBookList.createdCount}건을 등록했어요.`);
    },
  });

  const createBulk = (rows: BulkDraftRow[]) =>
    mutateAsync({
      input: {
        itemList: rows.map((row) => ({
          title: row.title.trim(),
          amount: row.amount,
          type: row.type,
          // 서버는 DateTime 을 받는다. 내역서에는 시각이 없으므로 그날의 시작으로 고정한다.
          registerDateTime: dayjs(row.date).startOf('day').toISOString(),
          // 호출부가 등록 전에 미지정 행을 막는다(missingCategoryCount)
          categoryId: row.categoryId as number,
        })),
      },
    });

  return { createBulk, isCreating: isPending };
};
