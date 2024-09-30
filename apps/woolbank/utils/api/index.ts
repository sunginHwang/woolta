import axios, { AxiosRequestConfig } from 'axios';
import config, { setConfig } from '../config';

// 개발 환경에서만 SSL 인증서 검증 비활성화
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

setConfig();

export type APIResponse<T> = {
  data: T;
  code: number;
  message: string;
};

export interface ContextConfig extends AxiosRequestConfig {
  useSSR?: string;
}

const apiCall = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true, // 쿠키 공유를 위해 필요
  headers: {
    'Content-Type': 'application/json',
  },
});

apiCall.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
apiCall.defaults.headers.common['Access-Control-Allow-Methods'] = '*';
apiCall.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
apiCall.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default apiCall;

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
  const isBrowser = typeof window !== 'undefined';
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    // window;
  }

  if (error instanceof Error) {
    return error.message;
  }
  return '알수없는 에러가 발생하였습니다.';
}
