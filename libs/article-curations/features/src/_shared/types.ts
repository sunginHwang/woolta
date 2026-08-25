/** 사이드바 스마트 리스트 키 */
export type ArticleSmartListKey = 'all' | 'curation';

/** 사이드바에서 선택 가능한 리스트 키 (스마트 리스트 또는 카테고리) */
export type ArticleListKey = ArticleSmartListKey | `category:${string}`;

export interface ArticleCategory {
  /** 카테고리 고유 id */
  id: string;
  /** 카테고리 이름 */
  name: string;
  /** 정렬 순서 */
  order: number;
  /** 생성일 (ISO 문자열) */
  createdAt: string;
}

export interface ArticleSeo {
  /** OG 제목 */
  title?: string;
  /** OG/메타 설명 */
  description?: string;
  /** OG 썸네일 이미지 URL */
  imageUrl?: string;
}

export interface Article {
  /** 아티클 고유 id */
  id: string;
  /** 소속 카테고리 id */
  categoryId: string;
  /** 제목 */
  title: string;
  /** 아티클 링크 */
  url: string;
  /** 링크에서 수집한 SEO 메타 정보 (수집 실패 시 없음) */
  seo?: ArticleSeo;
  /** 생성일 (ISO 문자열) */
  createdAt: string;
  /** 수정일 (ISO 문자열) */
  updatedAt: string;
}

export interface WeeklyCuration {
  /** ISO 주차 키 (예: 2026-W34) */
  weekKey: string;
  /** 큐레이션된 아티클 id 목록 (최대 WEEKLY_CURATION_LIMIT개) */
  articleIds: string[];
}
