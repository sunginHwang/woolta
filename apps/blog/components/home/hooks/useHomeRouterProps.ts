import { useSearchParams } from 'next/navigation';

export const useHomeRouterProps = () => {
  const params = useSearchParams();
  const categoryId = params.get('category') ?? '-1';

  return {
    categoryId,
  };
};
