import { AxiosRequestConfig } from 'axios';
import { cookies } from 'next/headers';

export function makeServerContext(): AxiosRequestConfig {
  const cookiesToString = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return {
    headers: {
      'Cookie': cookiesToString,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
}
