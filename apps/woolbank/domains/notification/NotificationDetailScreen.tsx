'use client';

import { NotificationDetail } from '@woolta/woolbank-features';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '../../components/Header/Header';

/**
 * 알림 상세. 푸시 클릭으로 바로 열리면 히스토리가 없어 back() 이 앱 밖으로 나가므로
 * 그 경우에는 알림함 목록으로 보낸다.
 */
export const NotificationDetailScreen = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';

  const handleBackClick = () => {
    if (typeof window !== 'undefined' && window.history.length <= 1) {
      router.replace('/notifications');
    }
  };

  return (
    <>
      <Header.Sub title='알림' onBackClick={handleBackClick} />
      <NotificationDetail id={id} />
    </>
  );
};
