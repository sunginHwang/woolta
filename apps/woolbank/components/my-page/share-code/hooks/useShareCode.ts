import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '../../../../hooks/useToast';
import { getData, postData } from '../../../../utils/api';

export const SHARE_CODE_QUERY_KEY = 'getShareCode';

const fetchShareCode = async () => {
  try {
    const res = await getData<{ shareCode: string }>('/auth/share-code');
    return res.data.shareCode;
  } catch {
    return '';
  }
};

const upsertShareCode = async () => {
  try {
    const res = await postData<{ shareCode: string }>('/auth/share-code');
    return res.data.shareCode;
  } catch {
    return '';
  }
};

export const useShareCode = () => {
  const { onToast } = useToast();
  const { data, refetch, ...rest } = useQuery({
    queryKey: [SHARE_CODE_QUERY_KEY],
    queryFn: fetchShareCode,
  });
  const upsertShareCodeMutation = useMutation({
    mutationFn: upsertShareCode,
    onSuccess: () => {
      onToast('초대코드 생성이 완료되었습니다.');
      refetch();
    },
    onError: () => {
      onToast('잠시후 다시 시도해 주세요.');
    },
  });

  const shareCode = data ?? '';

  return {
    shareCode,
    isExistShareCode: shareCode !== '',
    upsertShareCodeMutation,
    refetch,
    ...rest,
  };
};
