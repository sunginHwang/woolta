import { useRouter } from 'next/router';

export const useHomeRouterProps = () => {
  const { query } = useRouter();

  const categoryId = query.categoryId ? String(query.categoryId) : '';

  return {
    categoryId,
  };
};
