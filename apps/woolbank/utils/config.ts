export interface Config {
  accessToken: string;
  refreshToken: string;
  accessHeaderToken: string;
  accessTokenExpried: string;
  apiUrl: string;
}

const config = {} as Config;

export function setConfig() {
  Object.assign(config, {
    apiUrl: process.env.NEXT_PUBLIC_BANK_API ?? '',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    accessHeaderToken: 'bearer-auth',
    accessTokenExpried: 'jwt expired',
  });
}

export default config;
