import { ArticleSeo } from '../types';

/**
 * 호스트 앱의 article-meta 라우트를 통해 링크의 SEO 메타를 수집한다.
 * 수집 실패 시 null 을 반환하며, 호출부는 SEO 없이 저장을 진행한다.
 */
export const fetchArticleSeo = async (url: string): Promise<ArticleSeo | null> => {
  try {
    const response = await fetch(`/api/article-meta?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      return null;
    }

    const { title, description, imageUrl } = (await response.json()) as ArticleSeo;

    if (!title && !description && !imageUrl) {
      return null;
    }

    return { title, description, imageUrl };
  } catch {
    return null;
  }
};
