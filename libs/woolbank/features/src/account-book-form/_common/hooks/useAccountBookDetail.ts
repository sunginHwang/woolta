'use client';

import { useIsDashboardHost } from '@common';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import {
  useAccountBookQuery,
  useCreateAccountBookMutation,
  useDeleteAccountBookMutation,
  useUpdateAccountBookMutation,
} from '../../../_shared/api/gql.generated';
import type { AccountBook } from '../../../_shared/hooks/accountBookListApi';
import { useAccountBookList } from '../../../_shared/hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../../../_shared/stores/accountbookDate';
import { selectedAccountBookIdAtom } from '../../../_shared/stores/selectedAccountBook';
import { useToast } from '../../../_shared/toast/useToast';
import type { AccountBookSaveForm } from './useAccountBookForm';

/** 상세와 목록 항목은 서버에서 같은 AccountBook 타입이다. */
export type AccountBookDetail = AccountBook;

export const fetchAccountBookDetail = async (id: string | null) => {
  if (!id) {
    return null;
  }

  const data = await useAccountBookQuery.fetcher({ id })();

  return data.accountBook ?? null;
};

export const useAccountBookDetail = (id: string | null) => {
  const { back } = useRouter();
  const { onToast } = useToast();
  const queryClient = useQueryClient();
  const isDashboardHost = useIsDashboardHost();
  const setSelectedAccountBookId = useSetAtom(selectedAccountBookIdAtom);

  // 완료(저장/삭제) 후 동작 — 원본 앱은 이전 화면으로, 대시보드는 우측 패널 닫기
  const closeDetail = () => {
    if (isDashboardHost) {
      setSelectedAccountBookId(null);
      return;
    }
    back();
  };

  const deleteMutation = useDeleteAccountBookMutation();
  const updateMutation = useUpdateAccountBookMutation();
  const addMutation = useCreateAccountBookMutation();
  const selectedAccountBookDate = useAtomValue(selectedAccountBookDateAtom);

  const { data, ...rest } = useSuspenseQuery(getAccountBookFetchInfo(id));
  const {
    remove: removeAccountBookList,
    add: addAccountBookItem,
    update: updateAccountBookList,
  } = useAccountBookList();

  const upsertAccountBook = (accountBookForm: AccountBookSaveForm) => {
    const {
      id: formId,
      title,
      type,
      amount,
      memo,
      category,
      isDisabledBudget,
      scheduledPaymentType,
      scheduledPaymentDay,
      installmentMonth,
      registerDateTime,
    } = accountBookForm;

    // 서버는 카테고리를 Int 로 받는다(조회 응답의 id 는 GraphQL ID 문자열).
    const categoryId = Number(category.id);

    if (!formId) {
      addMutation.mutate(
        {
          input: {
            title,
            registerDateTime: registerDateTime.toISOString(),
            type,
            amount,
            memo,
            isDisabledBudget,
            scheduledPaymentType,
            scheduledPaymentDay,
            installmentMonth,
            categoryId,
          },
        },
        {
          onSuccess: ({ createAccountBook }) => {
            const registerDateMonth = dayjs(createAccountBook.registerDateTime).format('YYYY-MM');
            if (registerDateMonth === selectedAccountBookDate) {
              addAccountBookItem(createAccountBook);
            }
            onToast('작성되었습니다.');
            closeDetail();
          },
          onError: () => onToast('다시 시도해 주세요.'),
        },
      );
      return;
    }

    // 서버 UpdateAccountBookInput 에는 scheduledPayment*/installmentMonth 가 없다 —
    // 할부·예약결제는 생성 시에만 지정하는 것이 의도된 제약이다.
    updateMutation.mutate(
      {
        input: {
          id: formId,
          title,
          registerDateTime: registerDateTime.toISOString(),
          type,
          amount,
          memo,
          isDisabledBudget,
          categoryId,
        },
      },
      {
        onSuccess: ({ updateAccountBook }) => {
          queryClient.setQueryData(getQueryKey(id), updateAccountBook);
          updateAccountBookList(updateAccountBook);
          onToast('수정되었습니다.');
        },
        onError: () => onToast('다시 시도해 주세요.'),
      },
    );
  };

  const removeAccountBook = async (removeId: string) => {
    deleteMutation.mutate(
      { input: { id: removeId } },
      {
        onSuccess: () => {
          removeAccountBookList(removeId);
          queryClient.setQueryData(getQueryKey(removeId), () => null);
          onToast('정상적으로 삭제되었습니다.');
          closeDetail();
        },
        onError: () => onToast('다시 시도해 주세요.'),
      },
    );
  };

  return {
    accountBookDetail: data,
    upsertAccountBook,
    removeAccountBook,
    ...rest,
  };
};

function getQueryKey(id: string | null) {
  return useAccountBookQuery.getKey({ id: id ?? '' });
}

export function getAccountBookFetchInfo(id: string | null) {
  return {
    queryKey: getQueryKey(id),
    queryFn: () => fetchAccountBookDetail(id),
    enabled: !!id,
  };
}
