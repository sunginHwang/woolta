import dayjs from 'dayjs';

/**
 * 메모 작성/수정일 표시용 포맷 (예: 2026.08.20 14:30)
 */
export const formatMemoDate = (isoDate: string) => {
  return dayjs(isoDate).format('YYYY.MM.DD HH:mm');
};
