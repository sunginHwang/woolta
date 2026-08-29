import type { IconType } from 'react-icons';
import { FiBookOpen, FiCalendar, FiCheckSquare, FiClock, FiCreditCard, FiEdit3, FiFileText } from 'react-icons/fi';

export interface AppInfo {
  key: string;
  name: string;
  href: string;
  icon: IconType;
}

export const APP_LIST: AppInfo[] = [
  { key: 'schedule', name: '일정', href: '/schedule', icon: FiClock },
  { key: 'todo', name: 'TODO', href: '/todo', icon: FiCheckSquare },
  { key: 'bank', name: '가계부', href: '/bank', icon: FiCreditCard },
  { key: 'calendar', name: '캘린더', href: '/calendar', icon: FiCalendar },
  { key: 'blog', name: '블로그', href: '/blog', icon: FiBookOpen },
  { key: 'articles', name: '아티클', href: '/articles', icon: FiFileText },
  { key: 'memo', name: '메모', href: '/memo', icon: FiEdit3 },
];

export const findApp = (appKey: string) => APP_LIST.find((app) => app.key === appKey);
