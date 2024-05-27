import { AxiosRequestConfig } from 'axios';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export function makeServerContext(nextCookies: ReadonlyRequestCookies): AxiosRequestConfig {
  const cookieToString = nextCookies
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return {
    headers: {
      'Cookie': cookieToString,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
}
