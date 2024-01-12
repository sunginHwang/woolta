import { DehydratedState, HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import Header from '../../common/Header';
import AccountBookForm from './AccountBookForm';
import { AccountBookSaveForm } from './AccountBookForm/hooks/useAccountBookForm';
import { AccountBookDetail, getAccountBookFetchInfo, useAccountBookDetail } from './hooks/useAccountBookDetail';

export const AccountBookSavePage: NextPage<{
  dehydratedState?: DehydratedState;
}> = ({ dehydratedState }) => {
  const { get } = useSearchParams();
  const { accountBookDetail } = useAccountBookDetail(get('id'));
  const accountBookForm = getAccountBookFrom(accountBookDetail);
  return (
    <HydrationBoundary state={dehydratedState}>
      <Header.Sub title={accountBookDetail ? accountBookDetail.title : '거래 내역 추가'} />
      <AccountBookForm accountBookForm={accountBookForm} />
    </HydrationBoundary>
  );
};

function getAccountBookFrom(accountBookDetail: AccountBookDetail | null): AccountBookSaveForm | undefined {
  if (!accountBookDetail) {
    return undefined;
  }

  const { id, title, amount, memo = '', registerDateTime, category, type } = accountBookDetail;
  return {
    id,
    title,
    amount,
    memo,
    registerDateTime,
    category: {
      ...category,
      createdAt: category.createdAt.toDate(),
      updatedAt: category.updatedAt.toDate(),
    },
    type,
  };
}

export const getServerSidePropsForAccountBookFormSave: GetServerSideProps = async ({ query: { id }, req }) => {
  const queryClient = new QueryClient();

  if (id) {
    await queryClient.prefetchQuery(getAccountBookFetchInfo(id as string));
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
