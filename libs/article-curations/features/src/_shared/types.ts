import type {
  ArticleCategoryPartsFragment,
  ArticlePartsFragment,
  ArticleSeoInput,
  WeeklyCurationPartsFragment,
} from './api/gql.generated';

/** 사이드바 스마트 리스트 키 */
export type ArticleSmartListKey = 'all' | 'curation';

/** 사이드바에서 선택 가능한 리스트 키 (스마트 리스트 또는 카테고리) */
export type ArticleListKey = ArticleSmartListKey | `category:${string}`;

export type ArticleCategory = ArticleCategoryPartsFragment;

export type Article = ArticlePartsFragment;

/** 큐레이션은 주차별 아티클 id 목록만 갖는다. 아티클 본체는 목록 캐시에서 찾는다. */
export type WeeklyCuration = WeeklyCurationPartsFragment;

/** 링크에서 수집한 SEO 메타 (등록 요청에 실어 보내는 입력 형태) */
export type ArticleSeo = ArticleSeoInput;
