import { useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { getData } from '../../utils/api';

export const USER_INFO_QUERY_KEY = 'getUserInfo';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  loginType: string;
  authType: string;
}

interface ApiUserInfo {
  id: string;
  name: string;
  email: string;
  loginType: string;
  profileImg: string;
  socialId: string;
  updatedAt: string;
  authType: string;
}

export const fetchUserInfo = async (req?: AxiosRequestConfig) => {
  try {
    const { data } = await getData<ApiUserInfo>('/user', req);
    const userInfo: UserInfo = {
      id: data.id,
      name: data.name,
      email: data.email,
      imageUrl: data.profileImg,
      loginType: data.loginType,
      authType: data.authType,
    };
    return userInfo;
  } catch (e) {
    return null;
  }
};

export const useUserInfo = () => {
  const { data, ...rest } = useQuery({ queryKey: [USER_INFO_QUERY_KEY], queryFn: () => fetchUserInfo() });

  const userInfo = data ?? null;
  const isShareUser = userInfo?.authType !== 'share';

  return {
    userInfo,
    isShareUser,
    ...rest,
  };
};
