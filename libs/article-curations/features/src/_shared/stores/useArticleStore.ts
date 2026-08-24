import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';
import { WEEKLY_CURATION_LIMIT } from '../constants';
import { Article, ArticleCategory, WeeklyCuration } from '../types';

const createArticleId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getNextOrder = (items: { order: number }[]) =>
  items.length === 0 ? 0 : Math.max(...items.map((item) => item.order)) + 1;

interface AddArticleInput {
  /** 소속 카테고리 id */
  categoryId: string;
  /** 제목 */
  title: string;
  /** 아티클 링크 */
  url: string;
}

/** 아티클 id 목록에서 지정한 id들을 제거한 큐레이션 목록을 반환한다. (빈 주차는 제거) */
const removeArticleIdsFromCurations = (curationList: WeeklyCuration[], articleIds: string[]) =>
  curationList
    .map((curation) => ({
      ...curation,
      articleIds: curation.articleIds.filter((articleId) => !articleIds.includes(articleId)),
    }))
    .filter((curation) => curation.articleIds.length > 0);

export const useArticleStore = create(
  persist(
    combine(
      {
        articleList: [] as Article[],
        categoryList: [] as ArticleCategory[],
        curationList: [] as WeeklyCuration[],
      },
      (set, get) => ({
        addCategory: (name: string) => {
          const category: ArticleCategory = {
            id: createArticleId('category'),
            name,
            order: getNextOrder(get().categoryList),
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ categoryList: [...state.categoryList, category] }));
          return category.id;
        },
        updateCategory: (id: string, name: string) => {
          set((state) => ({
            categoryList: state.categoryList.map((category) =>
              category.id === id ? { ...category, name } : category,
            ),
          }));
        },
        removeCategory: (id: string) => {
          set((state) => {
            const removedArticleIds = state.articleList
              .filter((article) => article.categoryId === id)
              .map((article) => article.id);

            return {
              categoryList: state.categoryList.filter((category) => category.id !== id),
              articleList: state.articleList.filter((article) => article.categoryId !== id),
              curationList: removeArticleIdsFromCurations(state.curationList, removedArticleIds),
            };
          });
        },
        addArticle: ({ categoryId, title, url }: AddArticleInput) => {
          const now = new Date().toISOString();
          const article: Article = {
            id: createArticleId('article'),
            categoryId,
            title,
            url,
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({ articleList: [...state.articleList, article] }));
          return article.id;
        },
        removeArticle: (id: string) => {
          set((state) => ({
            articleList: state.articleList.filter((article) => article.id !== id),
            curationList: removeArticleIdsFromCurations(state.curationList, [id]),
          }));
        },
        toggleCuration: (weekKey: string, articleId: string) => {
          set((state) => {
            const curation = state.curationList.find((item) => item.weekKey === weekKey);

            if (curation === undefined) {
              return { curationList: [...state.curationList, { weekKey, articleIds: [articleId] }] };
            }
            if (curation.articleIds.includes(articleId)) {
              return { curationList: removeArticleIdsFromCurations(state.curationList, [articleId]) };
            }
            if (curation.articleIds.length >= WEEKLY_CURATION_LIMIT) {
              return {};
            }
            return {
              curationList: state.curationList.map((item) =>
                item.weekKey === weekKey ? { ...item, articleIds: [...item.articleIds, articleId] } : item,
              ),
            };
          });
        },
      }),
    ),
    { name: 'woolta:article-curations' },
  ),
);
