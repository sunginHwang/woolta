'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData, settingAccessHeaderToken } from '../api';
import { USER_INFO_QUERY_KEY } from '../query-keys';
import type { IUserInfo } from '../types/IUserInfo';

const initValue: IUserInfo = {
  no: 0,
  userId: '',
  imageUrl: '',
  authToken: '',
};

export async function fetchUserInfo() {
  try {
    const { data } = await getData<IUserInfo>('/user/check/jwt');
    return data;
  } catch {
    settingAccessHeaderToken('');
  }
  return initValue;
}

export const useUserInfo = () => {
  const appQueryClient = useQueryClient();
  const { data, ...rest } = useQuery({ queryKey: [USER_INFO_QUERY_KEY], queryFn: fetchUserInfo });
  const userInfo = data ?? initValue;
  const isLogin = userInfo.no !== 0;

  const logout = () => {
    settingAccessHeaderToken('');
    appQueryClient.setQueryData([USER_INFO_QUERY_KEY], () => initValue);
  };

  return {
    userInfo,
    isLogin,
    logout,
    ...rest,
  };
};
