import { IconAccountFill } from './AccountFill';
import { IconAccountOutline } from './AccountOutline';
import { IconBlackCircle } from './BlackCircle';
import { IconBucketOutline } from './BucketOutline';
import { IconCalendar } from './Calendar';
import { IconCalendarMonthOutline } from './CalendarMonthOutline';
import { IconCamera } from './Camera';
import { IconChartFill } from './ChartFill';
import { IconChevronDown } from './ChevronDown';
import { IconChevronLeft } from './ChevronLeft';
import { IconChevronRight } from './ChevronRight';
import { IconCircleCheck } from './CircleCheck';
import { IconClose } from './Close';
import { IconCloseCircle } from './CloseCircle';
import { IconDownHorizontal } from './DownHorizontal';
import { IconEditRegular } from './EditRegular';
import { IconFacebook } from './Facebook';
import { IconGoogle } from './Google';
import { IconHomeOutline } from './HomeOutline';
import { IconImage } from './Image';
import { IconKakaoTalk } from './KakaoTalk';
import { IconPigFill } from './PigFill';
import { IconPigOutline } from './PigOutline';
import { IconPlus } from './Plus';
import { IconSwap } from './Swap';
import { IconTrashCan } from './TrashCan';
import { IconWalletFill } from './WalletFill';
import { IconWalletOutline } from './WalletOutline';

export type { IconProps } from './createIcon';
export { createIcon } from './createIcon';

export {
  IconAccountFill,
  IconAccountOutline,
  IconBlackCircle,
  IconBucketOutline,
  IconCalendar,
  IconCalendarMonthOutline,
  IconCamera,
  IconChartFill,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconClose,
  IconCloseCircle,
  IconDownHorizontal,
  IconEditRegular,
  IconFacebook,
  IconGoogle,
  IconHomeOutline,
  IconImage,
  IconKakaoTalk,
  IconPigFill,
  IconPigOutline,
  IconPlus,
  IconSwap,
  IconTrashCan,
  IconWalletFill,
  IconWalletOutline,
};

/** 갤러리·문서용 — export 이름 → 컴포넌트. 아이콘을 추가하면 여기에도 등록한다 */
export const icons = {
  IconAccountFill,
  IconAccountOutline,
  IconBlackCircle,
  IconBucketOutline,
  IconCalendar,
  IconCalendarMonthOutline,
  IconCamera,
  IconChartFill,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconClose,
  IconCloseCircle,
  IconDownHorizontal,
  IconEditRegular,
  IconFacebook,
  IconGoogle,
  IconHomeOutline,
  IconImage,
  IconKakaoTalk,
  IconPigFill,
  IconPigOutline,
  IconPlus,
  IconSwap,
  IconTrashCan,
  IconWalletFill,
  IconWalletOutline,
} as const;

export type IconName = keyof typeof icons;

export const ICON_NAMES = Object.keys(icons) as IconName[];

/** 하단 내비게이션용 Outline/Fill 짝. SEED 규칙대로 활성 탭은 Fill, 비활성은 Outline 또는 톤만 바꾼다 */
export const NAVIGATION_ICON_PAIRS = [
  { label: '가계부', outline: IconPigOutline, fill: IconPigFill },
  { label: '정기지출', outline: IconWalletOutline, fill: IconWalletFill },
  { label: '통계', outline: IconAccountOutline, fill: IconChartFill },
  { label: '내 정보', outline: IconAccountOutline, fill: IconAccountFill },
] as const;
