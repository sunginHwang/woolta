export interface BlogConfig {
  imageApiUrl: string;
  tempPostAutoSaveKey: string;
  thumbnailImageUrl: string;
}

/**
 * blog 화면이 쓰는 값 중 호스트 앱마다 달라질 수 있는 것들.
 *
 * API 호스트는 여기 없다 — woolta-api 로 이관되면서 `@common/graphql` 의 `getGraphqlHost()` 가
 * 단일 기준이 됐다. 인증도 쿠키 세션이라 토큰 헤더 설정이 필요 없다.
 */
const _config: BlogConfig = {
  imageApiUrl: process.env.NEXT_PUBLIC_IMAGE_API ?? 'https://image.woolta.com',
  tempPostAutoSaveKey: 'TEMP_POST_AUTO_SAVE',
  thumbnailImageUrl: 'https://image.woolta.com/3fed2d102ca753c6.png',
};

export function setBlogConfig(config: Partial<BlogConfig>) {
  Object.assign(_config, config);
}

export function getBlogConfig(): BlogConfig {
  return _config;
}
