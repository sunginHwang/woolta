'use client';

import { useUserInfo } from '../../../hooks/queries/useUserInfo';
import AddButton from '../../common/AddButton';
import Header from '../../common/Header';
import { ShareUserAuthInfo } from '../common/ShareUserAuthInfo';
import { BucketListSlideViewer } from './BucketListSlideViewer';
/**
 * 버킷리스트
 * @component
 */
export const BucketList = () => {
  const { isShareUser } = useUserInfo();

  if (isShareUser) {
    return (
      <>
        <Header title='버킷리스트' />
        <ShareUserAuthInfo />
      </>
    );
  }

  return (
    <>
      <Header title='버킷리스트' />
      <BucketListSlideViewer />
      <AddButton href='/bucket-list/save' />
    </>
  );
};
