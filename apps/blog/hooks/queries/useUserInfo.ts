import { QueryClient, useQuery } from '@tanstack/react-query';
import { BLOG_API } from 'apps/blog/config';
import { IPost } from 'apps/blog/types/post/IPost';
import { IUserInfo } from 'apps/blog/types/user/IUserInfo';
import apiCall, { settingAccessHeaderToken } from 'apps/blog/utils/apiCall';

const USER_INFO_QUERY_KEY: string = 'getUserInfo';
const queryClient = new QueryClient();

const initValue: IUserInfo = {
  no: 0,
  userId: '',
  imageUrl: '',
  authToken: '',
};

type ApiRes<T> = {
  data: T;
  code: number;
};

export async function fetchUserInfo() {
  try {
    const { data } = await apiCall.get<ApiRes<IUserInfo>>(`${BLOG_API}/user/check/jwt`);
    return data.data;
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
