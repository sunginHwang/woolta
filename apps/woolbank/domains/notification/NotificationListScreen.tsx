'use client';

import { NotificationList } from '@woolta/woolbank-features';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header/Header';

/**
 * 알림함 목록. 상세 경로는 푸시의 navigate(`/notifications/{id}`)와 같다.
 * 푸시 클릭으로 연 창은 히스토리가 없어 back() 이 아무 일도 하지 않으므로 마이페이지로 보낸다.
 */
export const NotificationListScreen = () => {
  const router = useRouter();

  const handleBackClick = () => {
    if (typeof window !== 'undefined' && window.history.length <= 1) {
      router.replace('/my-page');
    }
  };

  return (
    <>
      <Header.Sub title='알림함' onBackClick={handleBackClick} />
      <NotificationList />
    </>
  );
};
