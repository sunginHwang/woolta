import { getCategoryListKey } from '@article-curations/features';
import { ArticleListScreen } from '@article-curations/screens';

export default async function ArticlesCategoryPage(props: { params: Promise<{ categoryId: string }> }) {
  const params = await props.params;
  return <ArticleListScreen listKey={getCategoryListKey(params.categoryId)} />;
}
