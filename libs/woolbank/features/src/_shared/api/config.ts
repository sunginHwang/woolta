export interface WoolbankConfig {
  apiUrl: string;
  /**
   * 브라우저에서 사용할 API base URL (미지정 시 apiUrl 사용).
   * 대시보드처럼 CORS 미허용 오리진에서 호스트 앱의 rewrites 프록시 경로(/api/bank)를 지정할 때 사용한다.
   */
  browserApiUrl?: string;
}

const config: WoolbankConfig = {
  apiUrl: process.env.NEXT_PUBLIC_BANK_API ?? '',
  browserApiUrl: process.env.NEXT_PUBLIC_BANK_API_BROWSER,
};

export function setWoolbankConfig(newConfig: Partial<WoolbankConfig>) {
  Object.assign(config, newConfig);
}

export function getConfig(): WoolbankConfig {
  return config;
}
