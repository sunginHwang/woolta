import dayjs from 'dayjs';
import { isOverdue } from './todoDate';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

interface DueDateLabelInfo {
  /** 화면에 표시할 마감일 라벨 */
  label: string;
  /** 기준일보다 지난(지연된) 마감일인지 여부 */
  isOverdue: boolean;
}

/** 마감일을 오늘/내일/날짜 형식의 라벨과 지연 여부로 변환한다. */
export const formatDueDate = (dueDate: string, baseDate: string): DueDateLabelInfo => {
  const base = dayjs(baseDate);
  const due = dayjs(dueDate);

  if (dueDate === baseDate) {
    return { label: '오늘', isOverdue: false };
  }
  if (dueDate === base.add(1, 'day').format('YYYY-MM-DD')) {
    return { label: '내일', isOverdue: false };
  }

  const label = due.year() === base.year() ? due.format('M월 D일') : due.format('YYYY년 M월 D일');
  return { label, isOverdue: isOverdue(dueDate, baseDate) };
};

/**
 * 미래 탭 날짜 그룹 헤더 라벨을 반환한다.
 * 내일은 '내일 ‧ 8월 24일 (일)', 그 외는 '8월 26일 (화)' 형태로 표시한다.
 * @param date 그룹 날짜 (YYYY-MM-DD)
 * @param baseDate 기준일 (YYYY-MM-DD)
 */
export const formatDateGroupLabel = (date: string, baseDate: string) => {
  const base = dayjs(baseDate);
  const target = dayjs(date);

  const datePart = target.year() === base.year() ? target.format('M월 D일') : target.format('YYYY년 M월 D일');
  const weekdayPart = `(${WEEKDAY_LABELS[target.day()]})`;
  const isTomorrow = date === base.add(1, 'day').format('YYYY-MM-DD');

  return isTomorrow ? `내일 ‧ ${datePart} ${weekdayPart}` : `${datePart} ${weekdayPart}`;
};
