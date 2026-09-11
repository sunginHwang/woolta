// 서버 스키마에서 생성된 타입을 도메인 이름으로 alias 한다.
// 손으로 쓰는 타입(types/ 디렉토리)은 클라이언트 전용 UI 상태만 남긴다.
import type { PostDetailPartsFragment, PostSummaryPartsFragment } from './api/gql.generated';

/** 목록용 요약 — content/writer 가 없다. */
export type PostSummary = PostSummaryPartsFragment;

/** 상세용 — subDescription/author 가 없고 writer 가 있다. */
export type PostDetail = PostDetailPartsFragment;
