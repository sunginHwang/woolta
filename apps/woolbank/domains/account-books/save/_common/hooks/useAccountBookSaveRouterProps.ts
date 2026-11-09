import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const useAccountBookSaveRouterProps = () => {
  const searchParams = useSearchParams();
  const account_book_id = searchParams.get('id');
  const is_insert_mode = account_book_id === null;
  // 달력 "이날 내역 추가" 진입 — 신규 작성일 때만 쓰고, 형식이 어긋나면 무시한다
  const dateParam = searchParams.get('date');
  const initial_date =
    is_insert_mode && dateParam && ISO_DATE_PATTERN.test(dateParam) && dayjs(dateParam).isValid() ? dateParam : null;

  return {
    account_book_id,
    is_insert_mode,
    initial_date,
  };
};
