import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getData } from '../../../../utils/api';
import { AxiosRequestConfig } from 'axios';

export const REGULAR_EXTENTIRE_LIST_QUERY_KEY = 'getRegularExtentireList';

export interface RegularExpenditure {
  id: number;
  title: string;
  amount: number;
  regularDate: number;
  isAutoExpenditure: boolean;
  userId: number;
  expenditureTypeId: number;
  regularExpenditureDay: string;
  accountBookCategory: {
    accountBookCategoryImage: {
      imageUrl: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface RegularExpenditureListItem {
  type: string;
  name: string;
  imageUrl: string;
  list: RegularExpenditure[];
}

const fetchRegularExtentureList = async (config?: AxiosRequestConfig) => {
  try {
    const res = await getData<RegularExpenditureListItem[]>('/regular-expenditures', config);
    return res.data;
  } catch (e) {
    return [];
  }
};

export const useRegularExtentureListQuery = () => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: [REGULAR_EXTENTIRE_LIST_QUERY_KEY],
    queryFn: fetchRegularExtentureList,
  });

  const regularExpenditureTypeList = data ?? [];

  return {
    regularExpenditureTypeList,
    ...rest,
  };
};

export function prefetchRegularExtentureList(client: QueryClient, { config }: { config?: AxiosRequestConfig }) {
  return client.prefetchQuery({
    queryKey: [REGULAR_EXTENTIRE_LIST_QUERY_KEY],
    queryFn: () => fetchRegularExtentureList(config),
  });
}
