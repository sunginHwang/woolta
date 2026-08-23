import { getCategoryListKey } from '@todo/features';
import { TodoListScreen } from '@todo/screens';

interface Props {
  params: { categoryId: string };
}

export default function TodoCategoryPage({ params }: Props) {
  return <TodoListScreen listKey={getCategoryListKey(params.categoryId)} />;
}
