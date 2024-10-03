'use client';

import { white } from '@wds';
import { useAtom } from 'jotai';
import { MdNotificationsActive } from 'react-icons/md';
import { styled } from 'styled-components';
import { toastMessageAtom } from '../../layout/store';
import { useEffect } from 'react';

const NOTIFICATION_ANIMATION_DURATION = 1_500;

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
    <SC.Container id='test'>
      <MdNotificationsActive />
      <SC.NotificationBarTitle>{toastMessage}</SC.NotificationBarTitle>
    </SC.Container>
  );
}

export default NotificationBar;

const SC = {
  Container: styled.div`
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    color: ${white};
    background-color: rgb(110, 130, 127);
    padding: 0.5rem 1rem;
    border-radius: 0.8rem;
    font-size: 1.8rem;
    opacity: 0.95;
    min-height: 10rem;
    min-width: 30rem;
    display: flex;
    align-items: center;

    @keyframes slide-in-from-right {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    animation: slide-in-from-right 0.5s forwards;
  `,
  NotificationBarTitle: styled.p`
    margin-left: 1rem;
    font-weight: bold;
  `,
};
