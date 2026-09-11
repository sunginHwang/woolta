import { useInput } from '@common';
import { useLoginByShareCode } from '@woolta/user-features';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/atom/Button';
import { BaseInput } from '../../../../components/base-input/BaseInput';
import { useToast } from '../../../../hooks/useToast';
import { LoginBox } from '../login-box/LoginBox';

export const IdLogin = () => {
  const [id, setId] = useInput('');
  const { onToast } = useToast();
  const router = useRouter();
  const { loginByShareCode, isLoggingIn } = useLoginByShareCode();

  const handleLoginClick = async () => {
    if (id === '') {
      onToast('공유코드를 입력해 주세요.');
      return;
    }

    try {
      await loginByShareCode(id);
      router.replace('/');
    } catch {
      onToast('잘못된 공유 코드 입니다.');
    }
  };

  return (
    <LoginBox title='공유코드 접속' type='normal'>
      <BaseInput label='공유코드' value={id} onChange={setId} placeholder='공유코드를 입력해 주세요.' />
      <Button fill color='red' loading={isLoggingIn} onClick={handleLoginClick}>
        공유코드 로그인 하기
      </Button>
    </LoginBox>
  );
};
