import { useSearchParams } from 'next/navigation';

export const useAccountBookSaveRouterProps = () => {
  const { get } = useSearchParams();
  const account_book_id = get('id');
  const is_insert_mode = account_book_id === null;

  return {
    account_book_id,
    is_insert_mode,
  };
};
