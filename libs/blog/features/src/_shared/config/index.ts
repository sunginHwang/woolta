export interface BlogConfig {
  apiUrl: string;
  /**
   * 브라우저에서 사용할 API base URL (미지정 시 apiUrl 사용).
   * CORS 미허용 오리진에서 호스트 앱의 rewrites 프록시 경로(/api/blog)를 지정할 때 사용한다.
   */
  browserApiUrl?: string;
  imageApiUrl: string;
  accessTokenCookie: string;
  accessHeaderToken: string;
  tempPostAutoSaveKey: string;
  thumbnailImageUrl: string;
}

const _config: BlogConfig = {
  apiUrl: process.env.NEXT_PUBLIC_BLOG_API ?? 'https://api-blog.woolta.com',
  browserApiUrl: process.env.NEXT_PUBLIC_BLOG_API_BROWSER,
  imageApiUrl: process.env.NEXT_PUBLIC_IMAGE_API ?? 'https://image.woolta.com',
  accessTokenCookie: '_WOOLTA_USER_',
  accessHeaderToken: 'Authorization',
  tempPostAutoSaveKey: 'TEMP_POST_AUTO_SAVE',
  thumbnailImageUrl: 'https://image.woolta.com/3fed2d102ca753c6.png',
};

export function setBlogConfig(config: Partial<BlogConfig>) {
  Object.assign(_config, config);
  // reset cached api client so next getApiClient() picks up new baseURL/headers
  resetApiClient();
}

export function getBlogConfig(): BlogConfig {
  return _config;
}

// forward-declaration; actual impl in api/index.ts
let _resetApiClient: (() => void) | null = null;

export function registerApiClientResetter(fn: () => void) {
  _resetApiClient = fn;
}

function resetApiClient() {
  _resetApiClient?.();
}
