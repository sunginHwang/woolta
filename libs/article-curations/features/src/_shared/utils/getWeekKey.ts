/** 날짜의 ISO 8601 주차 키를 반환한다. (예: 2026-W34) */
export const getWeekKey = (date: Date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() === 0 ? 7 : target.getUTCDay();

  // ISO 주차는 해당 주의 목요일이 속한 연도를 기준으로 한다.
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const isoYear = target.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const weekNumber = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return `${isoYear}-W${String(weekNumber).padStart(2, '0')}`;
};
