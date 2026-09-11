// 서버 스키마에서 생성된 타입을 도메인 이름으로 alias 한다.
// 손으로 쓰는 타입은 클라이언트 전용 UI 상태만 남긴다.
import type { SocialLoginType, UserInfoPartsFragment } from './api/gql.generated';

/** 로그인한 사용자 정보. */
export type UserInfo = UserInfoPartsFragment;

/** 소셜 로그인 제공자. DB의 레거시 표기(facebook/kakaoTalk/google)는 서버가 변환한다. */
export type { SocialLoginType };

/**
 * 공유코드 로그인은 읽기 전용 세션이다(`authType: 'share'`).
 * 서버의 requireRealUser 가 이 세션의 쓰기를 거부하므로, 화면에서도 편집 UI를 감춰야 한다.
 */
export const isReadOnlySession = (user: Pick<UserInfo, 'authType'> | undefined) => user?.authType === 'share';
