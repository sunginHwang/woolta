import axios, { AxiosRequestConfig } from 'axios';
import { ACCESS_HEADER_TOKEN, ACCESS_TOKEN, BLOG_API } from '../constants';

export type APIResponse<T> = {
  data: T;
  code: number;
  message: string;
};

let apiCall = axios.create({
  baseURL: BLOG_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof Storage !== 'undefined') {
  apiCall.defaults.headers.common[ACCESS_HEADER_TOKEN] = localStorage.getItem(ACCESS_TOKEN);
}

apiCall.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
apiCall.defaults.headers.common['Access-Control-Allow-Methods'] = '*';
apiCall.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
apiCall.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const requests: any = [];

apiCall.interceptors.request.use((req) => {
  if (requests.length === 0) {
    setProgress(25);
    startNanobar();
  }
  requests.push(req);
  return req;
});

apiCall.interceptors.response.use(
  (res) => {
    endNanobar();
    return res;
  },
  (res) => {
    endNanobar();
    return Promise.reject(res);
  },
);

export default apiCall;

let progress = 0;
let timerId: any = null;

function setProgress(value: number) {
  progress = value;
  // @ts-ignore
  if (typeof window !== 'undefined' && window.nanoBarLoading) {
    // @ts-ignore
    window.nanoBarLoading.go(progress);
  }
}

function startNanobar() {
  if (progress < 98) {
    const diff = 100 - progress; // 75
    const inc = diff / (10 + progress * (1 + progress / 100));
    setProgress(progress + inc);
  }
  timerId = setTimeout(startNanobar, 50);
}

function endNanobar() {
  setTimeout(() => {
    requests.pop();
    if (requests.length === 0) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      setProgress(100);
    }
  }, 150);
}

export function settingAccessHeaderToken(accessToken: string) {
  apiCall.defaults.headers.common[ACCESS_HEADER_TOKEN] = accessToken;
}

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
