import dayjs from 'dayjs';

/** 오늘 날짜를 YYYY-MM-DD 키로 반환한다. */
export const getTodayKey = () => dayjs().format('YYYY-MM-DD');

/** 기준일 다음 날을 YYYY-MM-DD 키로 반환한다. */
export const getTomorrowKey = (baseDate: string) => dayjs(baseDate).add(1, 'day').format('YYYY-MM-DD');

/** 마감일이 기준일 당일인지 여부를 반환한다. (YYYY-MM-DD 문자열 비교) */
export const isToday = (dueDate: string, baseDate: string) => dueDate === baseDate;

/** 마감일이 기준일보다 지났는지 여부를 반환한다. */
export const isOverdue = (dueDate: string, baseDate: string) => dueDate < baseDate;

/** 마감일이 기준일 이후(미래)인지 여부를 반환한다. */
export const isFuture = (dueDate: string, baseDate: string) => dueDate > baseDate;
