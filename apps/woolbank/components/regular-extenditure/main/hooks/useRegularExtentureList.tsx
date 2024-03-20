import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { deleteData, getData } from '../../../../utils/api';

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

const removeRegularExpenditure = async (id: number) => {
  const res = await deleteData(`/regular-expenditures/${id}`);
  return res.data;
};

export const useRegularExtentureList = () => {
  const queryClient = useQueryClient();
  const removeeRegularExtentureMutate = useMutation({
    mutationFn: (removeId: number) => removeRegularExpenditure(removeId),
  });
  const { data, ...rest } = useSuspenseQuery({
    queryKey: [REGULAR_EXTENTIRE_LIST_QUERY_KEY],
    queryFn: fetchRegularExtentureList,
  });

  const regularExpenditureTypeList = data ?? [];
  const flatRegularExpenditureTypeList = regularExpenditureTypeList.flatMap((item) => item.list);
  const totalAmount = flatRegularExpenditureTypeList.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);

  const removeRegularExtentureItem = (type: string, removeId: number) => {
    queryClient.setQueryData([REGULAR_EXTENTIRE_LIST_QUERY_KEY], (prev: RegularExpenditureListItem[]) => {
      return prev.reduce<RegularExpenditureListItem[]>((acc, item) => {
        if (item.type === type) {
          const updatedItem = {
            type,
            name: item.name,
            list: item.list.filter(({ id }) => id !== removeId),
          };

          updatedItem.list.length > 0 && acc.push(updatedItem);
        } else {
          acc.push(item);
        }

        return acc;
      }, []);
    });
  };

  return {
    removeeRegularExtentureMutate,
    removeRegularExtentureItem,
    regularExpenditureTypeList,
    flatRegularExpenditureTypeList,
    totalAmount,
    ...rest,
  };
};
