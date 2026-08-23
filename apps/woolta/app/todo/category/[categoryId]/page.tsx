import { getCategoryListKey } from '@todo/features';
import { TodoListPanel } from '@todo/screens';

interface Props {
  params: { categoryId: string };
}

export default function TodoCategoryPage({ params }: Props) {
  return <TodoListPanel listKey={getCategoryListKey(params.categoryId)} />;
}
