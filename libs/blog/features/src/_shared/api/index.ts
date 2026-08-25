import axios, { AxiosRequestConfig } from 'axios';
import { getBlogConfig, registerApiClientResetter } from '../config';

export type APIResponse<T> = {
  data: T;
  code: number;
  message: string;
};

let _apiClient: ReturnType<typeof axios.create> | null = null;

registerApiClientResetter(() => {
  _apiClient = null;
});

export function getApiClient() {
  if (!_apiClient) {
    const config = getBlogConfig();
    const isBrowser = typeof window !== 'undefined';
    _apiClient = axios.create({
      baseURL: isBrowser && config.browserApiUrl ? config.browserApiUrl : config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
    });
    _apiClient.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  }
  return _apiClient;
}

export function settingAccessHeaderToken(accessToken: string) {
  const config = getBlogConfig();
  getApiClient().defaults.headers.common[config.accessHeaderToken] = accessToken;
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
