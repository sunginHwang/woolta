import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getConfig, setWoolbankConfig } from './config';

export { setWoolbankConfig };

// lazy singleton — recreated whenever setWoolbankConfig is called
let _apiClient: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!_apiClient) {
    const { apiUrl, browserApiUrl } = getConfig();
    const isBrowser = typeof window !== 'undefined';

    _apiClient = axios.create({
      baseURL: isBrowser && browserApiUrl ? browserApiUrl : apiUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return _apiClient;
}

// Reset the client so next call picks up new config
export function _resetApiClient() {
  _apiClient = null;
}

export type APIResponse<T> = {
  data: T;
  code: number;
  message: string;
};

export interface ContextConfig extends AxiosRequestConfig {
  useSSR?: string;
}

export const getData = async <T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await getApiClient().get<APIResponse<T>>(url, config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const postData = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await getApiClient().post<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const putData = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await getApiClient().put<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteData = async <T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> => {
  try {
    const response = await getApiClient().delete<APIResponse<T>>(url, config);
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
