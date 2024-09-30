import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { prefetchRegularExtentureList } from 'apps/woolbank/components/regular-extenditure/main/hooks/useRegularExtentureListQuery';
import { AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';
import { RegularExpenditure } from '../../components/regular-extenditure/main';
import { getData } from '../../utils/api';

export default async function RegularExtenditurePage() {
  const queryClient = new QueryClient();
  const config: AxiosRequestConfig = {
    headers: {
      Cookie: cookies().toString(),
    },
  };

  await queryClient.prefetchQuery({
    queryKey: ['getAccountBookCategories'],
    queryFn: async () => {
      const { data } = await getData(`/account-book-categories`, config);
      return data;
    },
  });

  await prefetchRegularExtentureList(queryClient, { config });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RegularExpenditure />
    </HydrationBoundary>
  );
}
