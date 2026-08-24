import { getCategoryListKey } from '@article-curations/features';
import { ArticleListScreen } from '@article-curations/screens';

export default function ArticlesCategoryPage({ params }: { params: { categoryId: string } }) {
  return <ArticleListScreen listKey={getCategoryListKey(params.categoryId)} />;
}
