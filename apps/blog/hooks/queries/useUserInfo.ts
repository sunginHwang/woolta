import { QueryClient, useQuery } from '@tanstack/react-query';
import { IUserInfo } from 'apps/blog/types/user/IUserInfo';
import { getData, settingAccessHeaderToken } from 'apps/blog/utils/apiCall';

const USER_INFO_QUERY_KEY: string = 'getUserInfo';
const queryClient = new QueryClient();

const initValue: IUserInfo = {
  no: 0,
  userId: '',
  imageUrl: '',
  authToken: '',
};

export async function fetchUserInfo() {
  try {
    const { data } = await getData<IUserInfo>(`/user/check/jwt`);
    return data;
  } catch {
    settingAccessHeaderToken('');
  }
  return initValue;
}

export const useUserInfo = () => {
  const { data, ...rest } = useQuery({ queryKey: [USER_INFO_QUERY_KEY], queryFn: fetchUserInfo });
  const userInfo = data ?? initValue;
  const isLogin = userInfo.no !== 0;

  const logout = () => {
    settingAccessHeaderToken('');
    queryClient.setQueryData([USER_INFO_QUERY_KEY], () => initValue);
  };

  return {
    userInfo,
    isLogin,
    logout,
    ...rest,
  };
};
