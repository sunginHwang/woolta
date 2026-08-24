import { ArticleListKey } from './types';

/** 아티클 큐레이션 앱의 기준 경로 */
export const ARTICLES_BASE_PATH = '/articles';

const CATEGORY_KEY_PREFIX = 'category:';

/** 리스트 키가 카테고리 리스트면 카테고리 id를 반환한다. (아니면 null) */
export const getCategoryIdFromListKey = (listKey: ArticleListKey) =>
  listKey.startsWith(CATEGORY_KEY_PREFIX) ? listKey.slice(CATEGORY_KEY_PREFIX.length) : null;

/** 카테고리 id에 대응하는 리스트 키를 반환한다. */
export const getCategoryListKey = (categoryId: string): ArticleListKey => `${CATEGORY_KEY_PREFIX}${categoryId}`;

/** 리스트 키에 대응하는 경로를 반환한다. */
export const getArticleListHref = (listKey: ArticleListKey) => {
  const categoryId = getCategoryIdFromListKey(listKey);

  if (categoryId !== null) {
    return `${ARTICLES_BASE_PATH}/category/${categoryId}`;
  }
  if (listKey === 'all') {
    return ARTICLES_BASE_PATH;
  }
  return `${ARTICLES_BASE_PATH}/${listKey}`;
};

/** 해당 리스트가 현재 경로인지 판정한다. (전체는 정확 일치, 나머지는 접두 일치) */
export const isArticleListActive = (listKey: ArticleListKey, pathname: string) => {
  const href = getArticleListHref(listKey);
  return href === ARTICLES_BASE_PATH ? pathname === href : pathname.startsWith(href);
};
