import styled from '@emotion/styled';
import { blogPrimary, white } from 'apps/blog/style/colors';
import { useAtomValue } from 'jotai';
import { MdNotificationsActive } from 'react-icons/md';
import { toastMessageAtom } from '../../layout/store';

function NotificationBar() {
  const toastMessage = useAtomValue(toastMessageAtom);
  if (toastMessage === '') return null;

  return (
    <SC.Container isShow>
      <MdNotificationsActive />
      <SC.NotificationBarTitle>{toastMessage}</SC.NotificationBarTitle>
    </SC.Container>
  );
}

export default NotificationBar;

const SC = {
  Container: styled.div<{ isShow: boolean }>`
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    color: ${white};
    background-color: ${blogPrimary};
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
