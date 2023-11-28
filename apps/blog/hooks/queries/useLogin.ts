import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { ACCESS_TOKEN, BLOG_API, COOKIE_CONFIG } from 'apps/blog/config';
import { IUserInfo } from 'apps/blog/types/user/IUserInfo';
import apiCall, { ApiRes, settingAccessHeaderToken } from 'apps/blog/utils/apiCall';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const USER_INFO_QUERY_KEY: string = 'getUserInfo';

const initValue: IUserInfo = {
  no: 0,
  userId: '',
  imageUrl: '',
  authToken: '',
};

export function userLogin({ id, password }: { id: string; password: string }) {
  let data = new FormData();
  data.append('id', id);
  data.append('password', password);

  return apiCall.post<ApiRes<IUserInfo>>('/user/login', data);
}

export const useLogin = () => {
  const queryClient = new QueryClient();
  const { push } = useRouter();
  const loginMutate = useMutation({
    mutationFn: userLogin,
    onSuccess: (res) => {
      const userInfo = res.data.data;
      if (userInfo.authToken) {
        Cookies.set(ACCESS_TOKEN, userInfo.authToken, COOKIE_CONFIG);
        settingAccessHeaderToken(userInfo.authToken);
      }
      queryClient.setQueryData([USER_INFO_QUERY_KEY], () => userInfo);
      push('/');
    },
  });

  const login = (id: string, password: string) => {
    loginMutate.mutate({ id, password });
  };

  const logout = () => {
    settingAccessHeaderToken('');
    Cookies.remove(ACCESS_TOKEN);
    queryClient.setQueryData([USER_INFO_QUERY_KEY], () => initValue);
  };

  return {
    login,
    logout,
  };
};
