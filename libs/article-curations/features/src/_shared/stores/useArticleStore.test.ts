import { WEEKLY_CURATION_LIMIT } from '../constants';
import type { Article, ArticleCategory } from '../types';
import { useArticleStore } from './useArticleStore';

const baseCategory: ArticleCategory = {
  id: 'category-1',
  name: 'react',
  order: 0,
  createdAt: '2026-08-01T00:00:00.000Z',
};

const baseItem: Article = {
  id: 'article-1',
  categoryId: baseCategory.id,
  title: '기본 아티클',
  url: 'https://example.com/article',
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
};

const WEEK_KEY = '2026-W34';

describe('useArticleStore 테스트', () => {
  beforeEach(() => {
    useArticleStore.setState({ articleList: [], categoryList: [], curationList: [] });
  });

  describe('addCategory 테스트', () => {
    it('addCategory 를 호출하면 카테고리가 추가되고 생성된 id 를 반환한다.', () => {
      // Given
      useArticleStore.setState({ categoryList: [baseCategory] });

      // When
      const createdId = useArticleStore.getState().addCategory('js');

      // Then
      const { categoryList } = useArticleStore.getState();
      expect(categoryList).toHaveLength(2);
      expect(categoryList[1].id).toBe(createdId);
      expect(categoryList[1].name).toBe('js');
      expect(categoryList[1].order).toBe(baseCategory.order + 1);
    });
  });

  describe('updateCategory 테스트', () => {
    it('updateCategory 로 이름을 변경하면 해당 카테고리 이름만 갱신된다.', () => {
      // Given
      useArticleStore.setState({ categoryList: [baseCategory] });

      // When
      useArticleStore.getState().updateCategory(baseCategory.id, '알고리즘');

      // Then
      expect(useArticleStore.getState().categoryList[0].name).toBe('알고리즘');
    });
  });

  describe('removeCategory 테스트', () => {
    it('removeCategory 를 호출하면 카테고리와 소속 아티클, 큐레이션 항목이 함께 삭제된다.', () => {
      // Given
      const otherArticle = { ...baseItem, id: 'article-2', categoryId: 'category-2' };
      useArticleStore.setState({
        categoryList: [baseCategory],
        articleList: [baseItem, otherArticle],
        curationList: [{ weekKey: WEEK_KEY, articleIds: [baseItem.id, otherArticle.id] }],
      });

      // When
      useArticleStore.getState().removeCategory(baseCategory.id);

      // Then
      const { categoryList, articleList, curationList } = useArticleStore.getState();
      expect(categoryList).toHaveLength(0);
      expect(articleList).toEqual([otherArticle]);
      expect(curationList).toEqual([{ weekKey: WEEK_KEY, articleIds: [otherArticle.id] }]);
    });
  });

  describe('addArticle 테스트', () => {
    it('addArticle 을 호출하면 아티클이 추가되고 생성된 id 를 반환한다.', () => {
      // Given
      useArticleStore.setState({ categoryList: [baseCategory] });

      // When
      const createdId = useArticleStore
        .getState()
        .addArticle({ categoryId: baseCategory.id, title: '새 아티클', url: 'https://example.com/new' });

      // Then
      const { articleList } = useArticleStore.getState();
      expect(articleList).toHaveLength(1);
      expect(articleList[0].id).toBe(createdId);
      expect(articleList[0].title).toBe('새 아티클');
      expect(articleList[0].createdAt).toBe(articleList[0].updatedAt);
    });
  });

  describe('addArticle seo 저장 테스트', () => {
    it('addArticle 에 seo 를 넘기면 아티클에 함께 저장된다.', () => {
      // Given
      const seo = { description: 'SEO 설명', imageUrl: 'https://example.com/thumb.png' };

      // When
      const createdId = useArticleStore
        .getState()
        .addArticle({ categoryId: 'category-1', title: '제목', url: 'https://example.com', seo });

      // Then
      const created = useArticleStore.getState().articleList.find((article) => article.id === createdId);
      expect(created?.seo).toEqual(seo);
    });
  });

  describe('setArticleSeo 테스트', () => {
    it('setArticleSeo 를 호출하면 해당 아티클에 seo 정보가 저장된다.', () => {
      // Given
      useArticleStore.setState({ articleList: [baseItem] });
      const seo = { title: 'SEO 제목', description: 'SEO 설명', imageUrl: 'https://example.com/thumb.png' };

      // When
      useArticleStore.getState().setArticleSeo(baseItem.id, seo);

      // Then
      expect(useArticleStore.getState().articleList[0].seo).toEqual(seo);
    });

    it('setArticleSeo 에 존재하지 않는 id 를 넘기면 목록이 변하지 않는다.', () => {
      // Given
      useArticleStore.setState({ articleList: [baseItem] });

      // When
      useArticleStore.getState().setArticleSeo('unknown-id', { title: 'SEO 제목' });

      // Then
      expect(useArticleStore.getState().articleList).toEqual([baseItem]);
    });
  });

  describe('removeArticle 테스트', () => {
    it('removeArticle 을 호출하면 아티클이 삭제되고 큐레이션에서도 제거된다.', () => {
      // Given
      useArticleStore.setState({
        articleList: [baseItem],
        curationList: [{ weekKey: WEEK_KEY, articleIds: [baseItem.id] }],
      });

      // When
      useArticleStore.getState().removeArticle(baseItem.id);

      // Then
      const { articleList, curationList } = useArticleStore.getState();
      expect(articleList).toHaveLength(0);
      expect(curationList).toHaveLength(0);
    });
  });

  describe('toggleCuration 테스트', () => {
    it('큐레이션되지 않은 아티클을 토글하면 해당 주차에 추가된다.', () => {
      // Given
      useArticleStore.setState({ articleList: [baseItem], curationList: [] });

      // When
      useArticleStore.getState().toggleCuration(WEEK_KEY, baseItem.id);

      // Then
      expect(useArticleStore.getState().curationList).toEqual([{ weekKey: WEEK_KEY, articleIds: [baseItem.id] }]);
    });

    it('이미 큐레이션된 아티클을 토글하면 해당 주차에서 제거된다.', () => {
      // Given
      useArticleStore.setState({
        articleList: [baseItem],
        curationList: [{ weekKey: WEEK_KEY, articleIds: [baseItem.id] }],
      });

      // When
      useArticleStore.getState().toggleCuration(WEEK_KEY, baseItem.id);

      // Then
      expect(useArticleStore.getState().curationList).toHaveLength(0);
    });

    it(`한 주에 ${WEEKLY_CURATION_LIMIT}개가 이미 큐레이션되어 있으면 추가되지 않는다.`, () => {
      // Given
      const fullArticleIds = Array.from({ length: WEEKLY_CURATION_LIMIT }, (_, index) => `article-${index + 10}`);
      useArticleStore.setState({ curationList: [{ weekKey: WEEK_KEY, articleIds: fullArticleIds }] });

      // When
      useArticleStore.getState().toggleCuration(WEEK_KEY, baseItem.id);

      // Then
      expect(useArticleStore.getState().curationList[0].articleIds).toEqual(fullArticleIds);
    });

    it('다른 주차의 큐레이션은 토글에 영향을 받지 않는다.', () => {
      // Given
      const previousWeek = { weekKey: '2026-W33', articleIds: ['article-9'] };
      useArticleStore.setState({ curationList: [previousWeek] });

      // When
      useArticleStore.getState().toggleCuration(WEEK_KEY, baseItem.id);

      // Then
      const { curationList } = useArticleStore.getState();
      expect(curationList).toContainEqual(previousWeek);
      expect(curationList).toContainEqual({ weekKey: WEEK_KEY, articleIds: [baseItem.id] });
    });
  });
});
