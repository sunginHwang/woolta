import axios, { AxiosRequestConfig } from 'axios';
import config from '../config';

export type APIResponse<T> = {
  data: T;
  code: number;
  message: string;
};

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
}

const apiCall = axios.create({
  baseURL: 'https://banketlist-api.woolta.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof Storage !== 'undefined') {
  apiCall.defaults.headers.common[config.accessHeaderToken] =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJpYXQiOjE3MDQ0MjM0OTksImV4cCI6MTcwNTAyODI5OX0.Jv2p72MNqqX16UqpX-8lNEEBYMXrv8AGtSW3J5_Vw_ptBNjPeEf6lMUWWqxLor7XutVuxX1ysIc6H6rLlv0L3A';
}

apiCall.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
apiCall.defaults.headers.common['Access-Control-Allow-Methods'] = '*';
apiCall.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
apiCall.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

apiCall.interceptors.response.use(
  (res) => {
    return res;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: any) => {
    const isAccessTokenExpired =
      error.response.data.data.message === config.accessTokenExpried && error.response.status === 401;

    // accessToken 만료가 아닌 다른 에러는 바로 throw
    if (!isAccessTokenExpired) {
      return Promise.reject(error);
    }

    // 직전 호출 request
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(config.refreshToken);

    // accessToken 재발급은 첫 retry 일경우와 refresh 토큰이 있을 경우만 가능
    const isNotRetryGetAccessToken = originalRequest._retry || refreshToken === null;

    // Todo 인증이 안되니 정보 초기화 후 login 이동
    if (isNotRetryGetAccessToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    return apiCall
      .post('/auth/refresh-token-check', {
        refreshToken,
      })
      .then((response) => {
        const tokenInfo: TokenInfo = response.data.data.authTokens;
        setHeaderAuthToken(tokenInfo);
        // 이전요청에서의 헤더정보도 변경해서 호출해야 함.
        originalRequest.headers[config.accessHeaderToken] = response.data.data.authTokens.accessToken;
        return apiCall.request(originalRequest);
      });
  },
);

export default apiCall;

export const setHeaderAuthToken = (tokenInfo: TokenInfo) => {
  apiCall.defaults.headers.common[config.accessHeaderToken] = tokenInfo.accessToken;
};

export const saveToken = (tokenInfo: TokenInfo) => {
  localStorage.setItem(config.accessToken, tokenInfo.accessToken);
  localStorage.setItem(config.refreshToken, tokenInfo.refreshToken);
};

export const getData = async <T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await apiCall.get<APIResponse<T>>(url, config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const postData = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await apiCall.post<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const putData = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await apiCall.put<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteData = async <T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await apiCall.delete<APIResponse<T>>(url, config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return '알수없는 에러가 발생하였습니다.';
}
