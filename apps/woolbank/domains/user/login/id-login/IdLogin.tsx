import { useInput } from '@common';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../../hooks/useToast';
import { postData } from '../../../../utils/api';
import { Button } from '../../../../components/atom/Button';
import { BaseInput } from '../../../../components/base-input/BaseInput';
import { LoginBox } from '../login-box/LoginBox';

export const IdLogin = () => {
  const [id, setId] = useInput('');
  const { onToast } = useToast();
  const router = useRouter();
  const shareCodeLoginMutation = useMutation({
    mutationFn: (shareCode: string) => postData('/user/share-code-login', { shareCode }),
    onSuccess: () => {
      router.replace('/');
    },
    onError: () => onToast('잘못된 공유 코드 입니다.'),
  });

  const handleLoginClick = () => {
    if (id === '') {
      onToast('공유코드를 입력해 주세요.');
    }

    shareCodeLoginMutation.mutate(id);
  };

  return (
    <LoginBox title='공유코드 접속' type='normal'>
      <BaseInput label='공유코드' value={id} onChange={setId} placeholder='공유코드를 입력해 주세요.' />
      <Button fill color='red' loading={shareCodeLoginMutation.isPending} onClick={handleLoginClick}>
        공유코드 로그인 하기
      </Button>
    </LoginBox>
  );
};
