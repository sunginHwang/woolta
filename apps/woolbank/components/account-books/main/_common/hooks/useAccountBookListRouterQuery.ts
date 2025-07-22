'use client';

import { useSearchParams } from 'next/navigation';

export const useAccountBookListRouterQuery = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('type') ?? 'list';

  return {
    activeTab,
  };
};
