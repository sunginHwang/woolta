'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, shadowVars, zIndexConsts } from '@wds/tokens.stylex';
import { type FormEvent, Suspense, useState } from 'react';
import { FiX } from 'react-icons/fi';
import {
  REQUEST_SHARE_MESSAGE,
  useCancelCalendarShare,
  useRequestCalendarShare,
} from '../_shared/hooks/useCalendarShareMutations';
import { useCalendarShares } from '../_shared/hooks/useCalendarShares';

interface Props {
  onClose: () => void;
}

const styles = stylex.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    zIndex: zIndexConsts.layer,
    backgroundColor: colorVars['--color-bgOverlay'],
    backdropFilter: 'blur(4px)',
  },
  sheet: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    zIndex: zIndexConsts.layer,
    width: '100%',
    maxWidth: '42rem',
    marginBlock: 0,
    marginInline: 'auto',
    padding: '2.6rem',
    borderRadius: '1.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    boxShadow: shadowVars['--shadow-overlay'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.6rem',
  },
  iconButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  inviteRow: {
    display: 'flex',
    gap: '0.8rem',
    paddingTop: '1.2rem',
    paddingBottom: '0.8rem',
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingBlock: '0.9rem',
    paddingInline: '1.1rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':focus-visible': colorVars['--color-interactivePrimary'],
    },
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    outline: 'none',
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 3px color-mix(in srgb, ${colorVars['--color-interactivePrimary']} 18%, transparent)`,
    },
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  submitButton: {
    flexShrink: 0,
    paddingBlock: '0.8rem',
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
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    transition: 'background-color 0.15s',
  },
  resultMessage: {
    paddingBottom: '1.2rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    listStyle: 'none',
    marginBlock: 0,
    marginInline: 0,
    padding: 0,
    maxHeight: '28rem',
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBlock: '0.9rem',
    paddingInline: '0.6rem',
    borderRadius: '0.8rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    transition: 'background-color 0.15s',
  },
  itemBody: {
    flex: 1,
    minWidth: 0,
  },
  badge: {
    flexShrink: 0,
    paddingBlock: '0.25rem',
    paddingInline: '0.7rem',
    borderRadius: '99px',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
  },
  // 응답 대기: 중립 톤
  badgePending: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    borderColor: colorVars['--color-borderSubtle'],
  },
  // 공유 중: 성공 색상 테두리로 활성 상태를 색으로도 구분
  badgeActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    borderColor: colorVars['--color-statusSuccess'],
  },
  cancelButton: {
    flexShrink: 0,
    paddingBlock: '0.4rem',
    paddingInline: '0.8rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.6rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  empty: {
    paddingBlock: '2rem',
    paddingInline: 0,
  },
  sectionTitle: {
    paddingTop: '0.8rem',
    paddingBottom: '0.4rem',
  },
});

/**
 * 캘린더 공유 패널 — 이메일로 초대 + 공유 현황(수락됨 / 내가 보낸 대기).
 * 받은 초대는 여기가 아니라 전역 알림(CalendarShareNotification)에서 응답한다.
 */
export const CalendarSharePanel = ({ onClose }: Props) => {
  return (
    <>
      <div {...stylex.props(styles.backdrop)} onClick={onClose} />
      <div {...stylex.props(styles.sheet)}>
        <div {...stylex.props(styles.header)}>
          <Text as='h3' variant='title5Bold' color='textPrimary'>
            캘린더 공유
          </Text>
          <button type='button' title='닫기' {...stylex.props(styles.iconButton)} onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>
        <Text as='p' variant='small2Regular' color='textTertiary'>
          상대가 수락하면 서로의 일정을 볼 수 있어요. 수정은 각자 자기 일정만 할 수 있어요.
        </Text>

        <InviteForm />

        <div {...stylex.props(styles.sectionTitle)}>
          <Text variant='small1Bold' color='textTertiary'>
            공유 현황
          </Text>
        </div>
        <Suspense
          fallback={
            <div {...stylex.props(styles.empty)}>
              <Text as='p' variant='body3' color='textTertiary' alignment='center'>
                불러오는 중이에요
              </Text>
            </div>
          }
        >
          <ShareList />
        </Suspense>
      </div>
    </>
  );
};

const InviteForm = () => {
  const { requestShare, isRequesting } = useRequestCalendarShare();
  const [email, setEmail] = useState('');
  const [resultMessage, setResultMessage] = useState('');

  const canSubmit = email.trim().length > 0 && !isRequesting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }

    setResultMessage('');

    try {
      const { code } = await requestShare(email.trim());
      setResultMessage(REQUEST_SHARE_MESSAGE[code]);

      // 성사된 경우에만 입력을 비운다 — 오타로 실패했으면 고쳐서 다시 보내야 한다
      if (code === 'REQUESTED' || code === 'ACCEPTED_MUTUAL') {
        setEmail('');
      }
    } catch (error) {
      setResultMessage(error instanceof Error ? error.message : '초대를 보내지 못했어요.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div {...stylex.props(styles.inviteRow)}>
        <input
          {...stylex.props(styles.input)}
          type='email'
          placeholder='상대의 가입 이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type='submit' disabled={!canSubmit} {...stylex.props(styles.submitButton)}>
          초대
        </button>
      </div>
      {resultMessage !== '' && (
        <div {...stylex.props(styles.resultMessage)}>
          <Text variant='small2Regular' color='textSecondary'>
            {resultMessage}
          </Text>
        </div>
      )}
    </form>
  );
};

const ShareList = () => {
  const shares = useCalendarShares();
  const { cancelShare, isCancelling } = useCancelCalendarShare();

  if (shares.length === 0) {
    return (
      <div {...stylex.props(styles.empty)}>
        <Text as='p' variant='body3' color='textTertiary' alignment='center'>
          아직 공유 중인 상대가 없어요
        </Text>
      </div>
    );
  }

  const handleCancel = (id: number, isPending: boolean) => async () => {
    const message = isPending ? '보낸 초대를 취소할까요?' : '공유를 해제할까요? 서로의 일정이 보이지 않게 돼요.';
    if (!window.confirm(message)) {
      return;
    }
    await cancelShare(id);
  };

  return (
    <ul {...stylex.props(styles.list)}>
      {shares.map((share) => {
        const isPending = share.status === 'PENDING';

        return (
          <li key={share.id} {...stylex.props(styles.item)}>
            <div {...stylex.props(styles.itemBody)}>
              <Text as='p' variant='body3' color='textPrimary'>
                {share.counterpart.name || share.counterpart.email}
              </Text>
              <Text as='p' variant='small3Regular' color='textTertiary'>
                {share.counterpart.email}
              </Text>
            </div>
            <span {...stylex.props(styles.badge, isPending ? styles.badgePending : styles.badgeActive)}>
              <Text variant='small3Regular' color={isPending ? 'textTertiary' : 'textSecondary'}>
                {isPending ? '응답 대기' : '공유 중'}
              </Text>
            </span>
            <button
              type='button'
              disabled={isCancelling}
              {...stylex.props(styles.cancelButton)}
              onClick={handleCancel(share.id, isPending)}
            >
              {isPending ? '취소' : '해제'}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
