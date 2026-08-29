'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { MdNotificationsActive } from 'react-icons/md';
import { toastMessageAtom } from '../../layout/store';

const NOTIFICATION_ANIMATION_DURATION = 1_500;

const slideInFromRight = stylex.keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
});

const styles = stylex.create({
  container: {
    position: 'fixed',
    bottom: '0.5rem',
    right: '0.5rem',
    color: colorVars['--color-white'],
    backgroundColor: 'rgb(110, 130, 127)',
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
    borderRadius: '0.8rem',
    fontSize: '1.8rem',
    opacity: 0.95,
    minHeight: '10rem',
    minWidth: '30rem',
    display: 'flex',
    alignItems: 'center',
    animationName: slideInFromRight,
    animationDuration: '0.5s',
    animationFillMode: 'forwards',
  },
  title: {
    marginLeft: '1rem',
    fontWeight: 'bold',
  },
});

function NotificationBar() {
  const [toastMessage, setToastMessage] = useAtom(toastMessageAtom);

  useEffect(() => {
    if (toastMessage !== '') {
      setTimeout(() => setToastMessage(''), NOTIFICATION_ANIMATION_DURATION);
    }
  }, [toastMessage, setToastMessage]);

  if (toastMessage === '') {
    return null;
  }

  return (
    <div {...stylex.props(styles.container)} id='test'>
      <MdNotificationsActive />
      <p {...stylex.props(styles.title)}>{toastMessage}</p>
    </div>
  );
}

export default NotificationBar;
