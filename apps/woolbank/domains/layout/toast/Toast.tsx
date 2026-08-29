import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useAtomValue } from 'jotai';
import { toastAtom } from '../../../store/layout';

const styles = stylex.create({
  toast: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 999,
  },
  inner: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    backgroundColor: '#666666',
    paddingBlock: '1rem',
    paddingInline: '1.8rem',
    color: colorVars['--color-white'],
    fontSize: '1.4rem',
    borderRadius: '6.5rem',
  },
});

/**
 * 공통 - 토스트 메세지
 * @component
 */
export const Toast = () => {
  const toast = useAtomValue(toastAtom);

  const isHide = toast === '';
  if (isHide) {
    return null;
  }

  return (
    <div {...stylex.props(styles.toast)}>
      <div {...stylex.props(styles.inner)}>
        <p {...stylex.props(styles.message)}>{toast}</p>
      </div>
    </div>
  );
};
