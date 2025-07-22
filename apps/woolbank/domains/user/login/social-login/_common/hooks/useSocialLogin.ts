import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAlert } from '../../../../../../hooks/useAlert';
import { LoadingAtom } from '../../../../../../store/layout';
import { postData } from '../../../../../../utils/api';

export interface SocialUser {
  name: string;
  email: string;
  imageUrl: string;
  socialId: string | number;
  loginType: string;
}

export const createSocialUser = async (userInfo: SocialUser) => {
  return await postData('user/login/social', userInfo);
};

export const useSocialLogin = () => {
  const { onAlert } = useAlert();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setLoading = useSetAtom(LoadingAtom);

  const socialLoginMutate = useMutation({
    mutationFn: createSocialUser,
    onSuccess: () => {
      queryClient.clear();
      router.replace('/');
    },
    onError: () => {
      onAlert('다시 로그인 해 주세요.');
    },
  });

  useEffect(() => {
    if (socialLoginMutate.isPending) {
      setLoading({ isLoading: true, message: '로그인중입니다. 잠시만 기다려주세요.' });
    } else {
      setLoading({ isLoading: false, message: '' });
    }
  }, [socialLoginMutate.isPending, setLoading]);

  return {
    socialLoginMutate,
  };
};
