import { useSuspenseQuery } from '@tanstack/react-query';
import { getData } from '../../../../../utils/api';

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
  createdAt: string;
  updatedAt: string;
}

export interface RegularExpenditureListItem {
  type: string;
  name: string;
  list: RegularExpenditure[];
}

const fetchRegularExtentureList = async () => {
  try {
    const res = await getData<RegularExpenditureListItem[]>('/regular-expenditures');
    return res.data;
  } catch {
    return [];
  }
};

export const useRegularExtentureList = () => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: [REGULAR_EXTENTIRE_LIST_QUERY_KEY],
    queryFn: fetchRegularExtentureList,
  });

  const regularExpenditureTypeList = data ?? [];
  const flatRegularExpenditureTypeList = regularExpenditureTypeList.flatMap((item) => item.list);
  const totalAmount = flatRegularExpenditureTypeList.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);

  return {
    regularExpenditureTypeList,
    flatRegularExpenditureTypeList,
    totalAmount,
    ...rest,
  };
};
