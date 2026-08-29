'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useSetAtom } from 'jotai';
import { useAccountBookAddShortcut } from '../_shared/hooks/useAccountBookAddShortcut';
import { useUserInfo } from '../_shared/hooks/useUserInfo';
import { IconPlus } from '../_shared/icons';
import { NEW_ACCOUNT_BOOK_ID, selectedAccountBookIdAtom } from '../_shared/stores/selectedAccountBook';

const styles = stylex.create({
  // 리스트가 길어도 보이는 패널 하단에 붙도록 스크롤러 기준 sticky + 높이 0 앵커를 쓴다.
  anchor: {
    position: 'sticky',
    bottom: '2rem',
    display: 'flex',
    justifyContent: 'flex-end',
    height: 0,
    zIndex: 10,
  },
  fab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4.4rem',
    height: '4.4rem',
    borderStyle: 'none',
    borderRadius: '50%',
    transform: { default: 'translateY(-100%)', ':active': 'translateY(-100%) scale(0.96)' },
    backgroundColor: colorVars['--color-orangePrimary'],
    color: colorVars['--color-white'],
    boxShadow: '0 0.2rem 0.8rem rgba(0, 0, 0, 0.25)',
    cursor: 'pointer',
    filter: { default: null, ':hover': 'brightness(1.05)' },
  },
});

/**
 * 가계부 리스트 우측 하단의 새 내역 작성 플로팅 버튼.
 * 마운트되면 Q(q/Q/ㅂ/ㅃ) 단축키도 함께 등록되어 우측 패널에 작성 폼을 연다.
 * 공유 사용자는 작성 권한이 없어 노출하지 않는다.
 */
export const AccountBookAddButton = () => {
  const setSelectedAccountBookId = useSetAtom(selectedAccountBookIdAtom);
  const { isShareUser } = useUserInfo();

  const openAddForm = () => {
    if (isShareUser) {
      return;
    }
    setSelectedAccountBookId(NEW_ACCOUNT_BOOK_ID);
  };

  useAccountBookAddShortcut(openAddForm);

  if (isShareUser) {
    return null;
  }

  return (
    <div {...stylex.props(styles.anchor)}>
      <button
        type='button'
        title='새 내역 작성 (Q)'
        aria-label='새 내역 작성'
        onClick={openAddForm}
        {...stylex.props(styles.fab)}
      >
        <IconPlus width={22} height={22} fill='currentColor' />
      </button>
    </div>
  );
};
