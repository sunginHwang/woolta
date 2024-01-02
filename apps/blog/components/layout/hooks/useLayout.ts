import { usePathname } from 'next/navigation';

export const useLayout = () => {
  const pathname = usePathname();
  const isEditMode = pathname === '/write';

  return {
    isEditMode,
  };
};
