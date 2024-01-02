export interface Config {
  accessToken: string;
  refreshToken: string;
  accessHeaderToken: string;
  accessTokenExpried: string;
}

const config = {} as Config;

export function setConfig() {
  Object.assign(config, {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    accessHeaderToken: 'bearer-auth',
    accessTokenExpried: 'jwt expired',
  });
}

export default config;
