import { useSearchParams } from 'next/navigation';


export const useAccountBookListRouterQuery = () => {
  const { get } = useSearchParams();
  const activeTab = get('type') ?? 'list';
  return {
    activeTab,
  }
}
