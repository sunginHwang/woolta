import { getCategoryListKey } from '@todo/features';
import { TodoListScreen } from '@todo/screens';

interface Props {
  params: Promise<{ categoryId: string }>;
}

export default async function TodoCategoryPage(props: Props) {
  const params = await props.params;
  return <TodoListScreen listKey={getCategoryListKey(params.categoryId)} />;
}
