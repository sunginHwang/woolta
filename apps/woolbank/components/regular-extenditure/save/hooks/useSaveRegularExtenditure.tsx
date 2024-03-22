import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../../hooks/useToast';
import { postData } from '../../../../utils/api';
import { useRegularExtentureList } from '../../main/hooks/useRegularExtentureList';
import { RegularExtenditureForm } from '../../save/hooks/useRegularExtenditureForm';

export const addRegularExtenditure = async (regularExpenditureForm: RegularExtenditureForm) => {
  const { category, ...rest } = regularExpenditureForm;
  const requestParam = {
    ...rest,
    accountBookCategoryId: category.id,
  };
  const { data } = await postData('regular-expenditures', requestParam);
  return data;
};

export const useSaveRegularExtenditure = () => {
  const { back } = useRouter();
  const { onToast } = useToast();
  const { refetch } = useRegularExtentureList();
  const addMutation = useMutation({ mutationFn: addRegularExtenditure });

  const addRegularExpenditure = (regularExpenditureForm: RegularExtenditureForm) => {
    addMutation.mutate(regularExpenditureForm, {
      onSuccess: () => {
        refetch();
        back();
      },
      onError: () => onToast('다시 시도해 주세요.'),
    });
  };

  return {
    addRegularExpenditure,
  };
};
