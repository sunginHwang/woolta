'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, shadowVars } from '@wds/tokens.stylex';
import dayjs from 'dayjs';
import { FiChevronLeft, FiChevronRight, FiPlus, FiUsers } from 'react-icons/fi';
import { useCalendarStore } from '../../_shared/stores/useCalendarStore';
import type { CalendarViewMode } from '../../_shared/types';
import { formatRangeLabel, shiftBaseDate } from '../../_shared/utils/calendarRange';

const VIEW_OPTIONS: { value: CalendarViewMode; label: string }[] = [
  { value: 'month', label: '월' },
  { value: 'week', label: '주' },
  { value: 'day', label: '일' },
];

/** 새 일정 기본 길이 — 헤더의 '일정 등록' 은 드래그 구간이 없으니 1시간으로 연다 */
const DEFAULT_EVENT_HOURS = 1;

interface Props {
  /** 공유 패널 열기 */
  onShareClick: () => void;
}

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingBottom: '1.2rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    // bgSurfaceSecondary를 그리드가 쓰므로 더 옅은 토큰으로 헤더-그리드 경계를 은은하게 분리
    borderBottomColor: colorVars['--color-borderFaint'],
  },
  // 이동·오늘·라벨을 하나의 덩어리로 묶어 좌측 앵커 역할을 명확히 한다
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
  },
  navButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderWidth: 0,
    borderStyle: 'none',
    // 원형 — 아이콘 버튼의 관용 형태, 모서리 없이 가볍게
    borderRadius: '50%',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  todayButton: {
    paddingBlock: '0.5rem',
    paddingInline: '1.1rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    // borderSubtle보다 한 단계 강한 토큰 — 작은 pill이 배경에 묻히지 않게
    borderColor: colorVars['--color-borderDefault'],
    borderRadius: '2rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  label: {
    minWidth: 0,
    // 좌측 군집 안에서 살짝 앞당겨 라벨이 버튼군과 자연스럽게 이어지게
    marginLeft: '0.2rem',
  },
  spacer: {
    flex: 1,
  },
  viewToggle: {
    display: 'inline-flex',
    padding: '0.3rem',
    borderRadius: '1rem',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  viewButton: {
    paddingBlock: '0.5rem',
    paddingInline: '1.1rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.7rem',
    background: 'none',
    color: colorVars['--color-textTertiary'],
    fontSize: '1.2rem',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  viewButtonActive: {
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontWeight: 600,
    // 다크에서 bgSurface가 트랙보다 어두워 대비가 역전되는 문제를 shadow로 보완:
    // shadow-popover의 white ring(rgba(255,255,255,0.1))이 선택 탭 외곽을 드러낸다
    boxShadow: shadowVars['--shadow-popover'],
  },
  shareButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBlock: '0.6rem',
    paddingInline: '1.1rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.8rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textSecondary'],
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBlock: '0.6rem',
    paddingInline: '1.4rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
    },
    color: colorVars['--color-textInverse'],
    fontSize: '1.3rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
});

/** 캘린더 헤더 — 기간 이동 / 뷰 전환 / 일정 등록 / 공유. 네비게이션은 store 가 단일 소유자다. */
export const CalendarBoardHeader = ({ onShareClick }: Props) => {
  const viewMode = useCalendarStore((state) => state.viewMode);
  const baseDateIso = useCalendarStore((state) => state.baseDateIso);
  const setViewMode = useCalendarStore((state) => state.setViewMode);
  const setBaseDate = useCalendarStore((state) => state.setBaseDate);
  const openNewEvent = useCalendarStore((state) => state.openNewEvent);

  const handleTodayClick = () => {
    setBaseDate(dayjs().toISOString());
  };

  const handleCreateClick = () => {
    // 다음 정시부터 1시간 — 지금 시각 그대로 열면 분 단위가 지저분해진다
    const start = dayjs(baseDateIso).startOf('hour').add(1, 'hour');
    openNewEvent({
      startAt: start.toISOString(),
      endAt: start.add(DEFAULT_EVENT_HOURS, 'hour').toISOString(),
      isAllDay: false,
    });
  };

  return (
    <div {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.leftGroup)}>
        <div {...stylex.props(styles.nav)}>
          <button
            type='button'
            title='이전'
            {...stylex.props(styles.navButton)}
            onClick={() => setBaseDate(shiftBaseDate(viewMode, baseDateIso, -1))}
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type='button'
            title='다음'
            {...stylex.props(styles.navButton)}
            onClick={() => setBaseDate(shiftBaseDate(viewMode, baseDateIso, 1))}
          >
            <FiChevronRight size={18} />
          </button>
        </div>
        <button type='button' {...stylex.props(styles.todayButton)} onClick={handleTodayClick}>
          오늘
        </button>
        <div {...stylex.props(styles.label)}>
          <Text as='h2' variant='title4Bold' color='textPrimary'>
            {formatRangeLabel(viewMode, baseDateIso)}
          </Text>
        </div>
      </div>

      <div {...stylex.props(styles.spacer)} />

      <div {...stylex.props(styles.viewToggle)}>
        {VIEW_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type='button'
            {...stylex.props(styles.viewButton, viewMode === value && styles.viewButtonActive)}
            onClick={() => setViewMode(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <button type='button' {...stylex.props(styles.shareButton)} onClick={onShareClick}>
        <FiUsers size={14} />
        공유
      </button>
      <button type='button' {...stylex.props(styles.actionButton)} onClick={handleCreateClick}>
        <FiPlus size={14} />
        일정 등록
      </button>
    </div>
  );
};
