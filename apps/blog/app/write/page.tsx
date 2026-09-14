/**
 * 정적 프리렌더 대상에서 뺀다.
 *
 * 에디터가 카테고리 목록을 조회하는데, 정적 생성이면 그 호출이 **빌드 타임에** 일어난다.
 * 빌드가 API 가동에 묶이고(안 떠 있으면 ECONNREFUSED 로 빌드 실패),
 * 빌드 시점의 카테고리가 정적 페이지에 박힌다.
 *
 * 로그인이 필요한 화면이라 정적 생성의 이득도 없다 — 요청 시점에 렌더한다.
 */
export const dynamic = 'force-dynamic';

import { PostWrite } from '@blog/features';

const WritePage = () => {
  return <PostWrite />;
};

export default WritePage;
