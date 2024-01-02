import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getData } from '../../utils/api';

export const USER_INFO_QUERY_KEY = 'getUserInfo';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  authToken: string;
}

interface ApiUserInfo {
  authTokens: {
    accessToken: string;
    refreshToken: string;
  };
  userInfo: {
    id: string;
    name: string;
    email: string;
    loginType: string;
    profileImg: string;
    socialId: string;
    updatedAt: string;
  };
}

const fetchUserInfo = async () => {
  try {
    const res = await getData<ApiUserInfo>('/auth/check');
    return {
      id: res.data.userInfo.id,
      name: res.data.userInfo.name,
      email: res.data.userInfo.email,
      imageUrl: res.data.userInfo.profileImg,
      authToken: res.data.authTokens.accessToken,
    } as UserInfo;
  } catch {
    return null;
  }
};

export const useUserInfo = () => {
  const { data, ...rest } = useSuspenseQuery({ queryKey: [USER_INFO_QUERY_KEY], queryFn: fetchUserInfo });
  return {
    userInfo: data ?? null,
    ...rest,
  };
};
