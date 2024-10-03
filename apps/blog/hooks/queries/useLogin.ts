import { QueryClient, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { IUserInfo } from '../../types/user/IUserInfo';
import apiCall, { APIResponse, settingAccessHeaderToken } from '../../utils/api';
import config from '../../utils/config';

const USER_INFO_QUERY_KEY = 'getUserInfo';

const initValue: IUserInfo = {
  no: 0,
  userId: '',
  imageUrl: '',
  authToken: '',
};

export function userLogin({ id, password }: { id: string; password: string }) {
  const data = new FormData();
  data.append('id', id);
  data.append('password', password);

  return apiCall.post<APIResponse<IUserInfo>>('/user/login', data);
}

export const useLogin = () => {
  const queryClient = new QueryClient();
  const { push } = useRouter();
  const loginMutate = useMutation({
    mutationFn: userLogin,
    onSuccess: (res) => {
      const userInfo = res.data.data;
      if (userInfo.authToken) {
        Cookies.set(config.accessToken, userInfo.authToken, config.cookieConfig);
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
    Cookies.remove(config.accessToken);
    queryClient.setQueryData([USER_INFO_QUERY_KEY], () => initValue);
  };

  return {
    login,
    logout,
  };
};
