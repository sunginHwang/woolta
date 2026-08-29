'use client';

export interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}

// AccountOutline
const AccountOutline = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z'
    />
  </svg>
);

export { AccountOutline as IconAccountOutline };

// HomeOutline
const HomeOutline = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path fill={fill} d='M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z' />
  </svg>
);

export { HomeOutline as IconHomeOutline };

// BucketOutline
const BucketOutline = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M19.79,7.5L11.5,3.21L3.21,7.5L11.5,11.79L19.79,7.5M11.5,13.21L3,8.79V17L11.5,21.29L20,17V8.79L11.5,13.21Z'
    />
  </svg>
);

export { BucketOutline as IconBucketOutline };

// PigOutline
const PigOutline = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M19,14C19,15.66 18.53,17.22 17.71,18.55L19,20H16.9C15.75,20.63 14.42,21 13,21H7C4.79,21 3,19.21 3,17V11.47C3,10.1 3.72,8.9 4.81,8.23C4.29,7.56 4,6.82 4,6C4,4.67 4.76,3.5 5.85,2.84C6.84,2.29 8.21,2.12 9.5,2.5C10.5,2.79 11.15,3.23 11.5,3.56C11.5,3.38 12,3 12,3H15V5H14.25L15,8H19C21.21,8 23,9.79 23,12V14H19M19,10V8H17V10H19M7,17H9V15H7V17M11,17H13V15H11V17M15,17H17V15H15V17M5,13H9V11H5V13Z'
    />
  </svg>
);

export { PigOutline as IconPigOutline };

// WalletOutline
const WalletOutline = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M17,12V3A1,1 0 0,0 16,2H3A1,1 0 0,0 2,3V17A3,3 0 0,0 5,20H19A3,3 0 0,0 22,17V13A1,1 0 0,0 21,12H17M7,14H5V12H7V14M7,10H5V8H7V10M7,6H5V4H7V6M15,10H9V4H15V10M19,18A1,1 0 0,1 18,19H5.5A1.5,1.5 0 0,1 4,17.5V17H19V18Z'
    />
  </svg>
);

export { WalletOutline as IconWalletOutline };

// ChevronLeft
const ChevronLeft = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path fill={fill} d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z' />
  </svg>
);

export { ChevronLeft as IconChevronLeft };

// ChevronRight
export const IconChevronRight = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} fill='none' viewBox='0 0 24 24'>
    <path
      fill={fill}
      fillRule='evenodd'
      d='M14.94 12 7.47 4.53l1.06-1.06L17.06 12l-8.53 8.53-1.06-1.06L14.94 12Z'
      clipRule='evenodd'
    />
  </svg>
);

// ChevronDown
const ChevronDown = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path fill={fill} d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' />
  </svg>
);

export { ChevronDown as IconChevronDown };

// Close
const Close = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'
    />
  </svg>
);

export { Close as IconClose };

// CloseCircle
const CloseCircle = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
    />
  </svg>
);

export { CloseCircle as IconCloseCircle };

// TrashCan
const TrashCan = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' data-cy='icoTrashCan' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z'
    />
  </svg>
);

export { TrashCan as IconTrashCan };

// CircleCheck
const CircleCheck = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    />
  </svg>
);

export { CircleCheck as IconCircleCheck };

// CalendarMonthOutline
const CalendarMonthOutline = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z'
    />
  </svg>
);

export { CalendarMonthOutline as IconCalendarMonthOutline };

// DownHorizontal
const DownHorizontal = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path fill={fill} d='M7.41 8.58L12 13.17 16.59 8.58 18 10l-6 6-6-6 1.41-1.42z' />
  </svg>
);

export { DownHorizontal as IconDownHorizontal };

// BlackCircle
const BlackCircle = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <circle cx='12' cy='12' r='10' fill={fill} />
  </svg>
);

export { BlackCircle as IconBlackCircle };

// Plus
const Plus = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path fill={fill} d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' />
  </svg>
);

export { Plus as IconPlus };

// Image
const Image = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z'
    />
  </svg>
);

export { Image as IconImage };

// Camera
const Camera = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z'
    />
  </svg>
);

export { Camera as IconCamera };

// Calendar (non-barrel, named export)
export const IconCalendar = ({ width = 24, height = 24, fill = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} fill='none' viewBox='0 0 24 24' className={className}>
    <path
      fill={fill}
      fillRule='evenodd'
      d='M8.75 2v2h6.5V2h1.5v2H22v18H2V4h5.25V2h1.5Zm6.5 3.5V8h1.5V5.5h3.75v4.75h-17V5.5h3.75V8h1.5V5.5h6.5ZM3.5 11.75v8.75h17v-8.75h-17Z'
      clipRule='evenodd'
    />
  </svg>
);

// Swap (named export)
export const IconSwap = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} fill='none' viewBox='0 0 24 24'>
    <path
      fill={fill}
      fillRule='evenodd'
      d='m7.406 11.122-.53-.53-2.418-2.418h-.165v-.165l-.073-.073-.53-.53.53-.53.073-.074v-.128h.128L6.875 4.22l.53-.53 1.061 1.06-.53.53-1.394 1.394h10a4.25 4.25 0 0 1 4.25 4.25v.79h-1.5v-.79a2.75 2.75 0 0 0-2.75-2.75H6.58L7.936 9.53l.53.53-1.06 1.06ZM20.5 18.255h-.128l-2.454 2.454-.53.53-1.061-1.06.53-.53 1.394-1.394h-10A4.25 4.25 0 0 1 4 14.005v-.79h1.5v.79a2.75 2.75 0 0 0 2.75 2.75H18.213l-1.357-1.357-.53-.53 1.06-1.061.53.53 2.418 2.418h.165v.165l.073.073.53.53-.53.53-.073.073v.129Z'
      clipRule='evenodd'
    />
  </svg>
);

// KakaoTalk
export const KakaoTalk = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M12,3C6.48,3 2,6.69 2,11.26C2,14.05 3.7,16.53 6.31,18.07L5.36,21.83L9.57,19.28C10.34,19.43 11.16,19.52 12,19.52C17.52,19.52 22,15.83 22,11.26C22,6.69 17.52,3 12,3Z'
    />
  </svg>
);
export { KakaoTalk as IconKakaoTalk };

// Facebook
export const Facebook = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z'
    />
  </svg>
);
export { Facebook as IconFacebook };

// Google
export const Google = ({ width = 24, height = 24, fill = 'currentColor' }: IconProps) => (
  <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
    <path
      fill={fill}
      d='M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z'
    />
  </svg>
);
export { Google as IconGoogle };
