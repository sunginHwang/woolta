import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteData } from '../../../../utils/api';
import {
  REGULAR_EXTENTIRE_LIST_QUERY_KEY,
  RegularExpenditureListItem,
  useRegularExtentureListQuery,
} from './useRegularExtentureListQuery';

const removeRegularExpenditure = async (id: number) => {
  const res = await deleteData(`/regular-expenditures/${id}`);
  return res.data;
};

export const useRegularExtentureList = () => {
  const queryClient = useQueryClient();
  const { regularExpenditureTypeList, ...rest } = useRegularExtentureListQuery();
  const removeeRegularExtentureMutate = useMutation({
    mutationFn: (removeId: number) => removeRegularExpenditure(removeId),
  });

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
            imageUrl: item.imageUrl,
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
