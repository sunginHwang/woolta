'use client';

import AddButton from '../../common/AddButton';
import Header from '../../common/Header';
import { BucketListSlideViewer } from './BucketListSlideViewer';
/**
 * 버킷리스트
 * @component
 */
export const BucketList = () => {
  return (
    <>
      <Header title='버킷리스트' />
      <BucketListSlideViewer />
      <AddButton href='/bucket-list/save' />
    </>
  );
};
