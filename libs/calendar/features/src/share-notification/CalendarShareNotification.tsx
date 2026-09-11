'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, shadowVars, zIndexConsts } from '@wds/tokens.stylex';
import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useRespondCalendarShare } from '../_shared/hooks/useCalendarShareMutations';
import { usePendingCalendarShares } from '../_shared/hooks/usePendingCalendarShares';

interface Props {
  /** 레일이 펼쳐져 있으면 라벨을 같이 보여준다 */
  isExpanded?: boolean;
  /** 팝오버 위치 — 호스트 레이아웃이 정한다 */
  popoverStyle?: stylex.StyleXStyles;
  /** 레일 아이템과 같은 모양을 쓰도록 호스트가 넘기는 스타일 */
  itemStyle?: stylex.StyleXStyles;
}

const styles = stylex.create({
  /**
   * 배지를 절대배치하려면 래퍼가 필요한데, 그만큼 버튼이 호스트(레일)의 flex 자식에서
   * 한 단계 밀려난다. 래퍼를 그대로 두면 버튼이 콘텐츠 폭으로 줄어들어 hover 영역이
   * 다른 레일 항목과 달라지므로, 래퍼를 flex 컨테이너로 만들어 버튼을 다시 늘려준다.
   */
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  badge: {
    position: 'absolute',
    top: '0.4rem',
    right: '0.6rem',
    minWidth: '1.6rem',
    height: '1.6rem',
    paddingInline: '0.4rem',
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-statusError'],
    color: colorVars['--color-white'],
    fontSize: '1rem',
    lineHeight: '1.6rem',
    textAlign: 'center',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: zIndexConsts.layer,
  },
  popover: {
    position: 'fixed',
    zIndex: zIndexConsts.layer,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    width: '30rem',
    padding: '1.6rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgSurface'],
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    // 하드코딩하면 다크 오버라이드(흰 1px 링이 더해진 그림자)를 못 받는다
    boxShadow: shadowVars['--shadow-popover'],
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    listStyle: 'none',
    marginBlock: 0,
    marginInline: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    paddingBottom: '0.8rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
  },
  actions: {
    display: 'flex',
    gap: '0.6rem',
  },
  acceptButton: {
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.6rem',
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
    },
    color: colorVars['--color-textInverse'],
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  declineButton: {
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.6rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  label: {
    fontSize: '1.3rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  iconSlot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '2rem',
  },
});

/**
 * 받은 캘린더 공유 초대 알림.
 *
 * 로그인하면 대기 중 초대 개수가 배지로 뜨고, 여기서 바로 수락/거절한다.
 * 전역 레일에 놓여 Suspense·error 경계가 없으므로 조회는 suspense 가 아닌 쿼리를 쓴다
 * (usePendingCalendarShares 주석 참고) — 미인증·실패 시 배지 없이 조용히 빠진다.
 */
export const CalendarShareNotification = ({ isExpanded = false, popoverStyle, itemStyle }: Props) => {
  const { pendingShares } = usePendingCalendarShares();
  const { respondShare, isResponding } = useRespondCalendarShare();
  const [isOpen, setIsOpen] = useState(false);

  const pendingCount = pendingShares.length;

  const handleRespond = (id: number, isAccepted: boolean) => async () => {
    await respondShare(id, isAccepted);

    // 마지막 초대를 처리했으면 팝오버를 닫는다 (빈 팝오버가 남지 않게)
    if (pendingCount <= 1) {
      setIsOpen(false);
    }
  };

  return (
    <div {...stylex.props(styles.wrapper)}>
      <button type='button' title='알림' {...stylex.props(itemStyle)} onClick={() => setIsOpen((prev) => !prev)}>
        <span {...stylex.props(styles.iconSlot)}>
          <FiBell size={20} />
        </span>
        {isExpanded && <span {...stylex.props(styles.label)}>알림</span>}
        {pendingCount > 0 && <span {...stylex.props(styles.badge)}>{pendingCount}</span>}
      </button>

      {isOpen && (
        <>
          <div {...stylex.props(styles.backdrop)} onClick={() => setIsOpen(false)} />
          <div {...stylex.props(styles.popover, popoverStyle)}>
            <Text as='h3' variant='small1Bold' color='textPrimary'>
              캘린더 공유 요청
            </Text>
            {pendingCount === 0 ? (
              <Text as='p' variant='small2Regular' color='textTertiary'>
                새 알림이 없어요
              </Text>
            ) : (
              <ul {...stylex.props(styles.list)}>
                {pendingShares.map((share) => (
                  <li key={share.id} {...stylex.props(styles.item)}>
                    <Text as='p' variant='small2Regular' color='textSecondary'>
                      <strong>{share.counterpart.name || share.counterpart.email}</strong> 님이 캘린더 공유를
                      요청했어요.
                    </Text>
                    <div {...stylex.props(styles.actions)}>
                      <button
                        type='button'
                        disabled={isResponding}
                        {...stylex.props(styles.acceptButton)}
                        onClick={handleRespond(share.id, true)}
                      >
                        수락
                      </button>
                      <button
                        type='button'
                        disabled={isResponding}
                        {...stylex.props(styles.declineButton)}
                        onClick={handleRespond(share.id, false)}
                      >
                        거절
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};
