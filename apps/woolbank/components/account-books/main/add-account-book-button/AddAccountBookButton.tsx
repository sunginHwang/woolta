'use client';

import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import AddButton from '../../../common/AddButton';

/**
 * 가계부 추가 버튼
 * @component
 */
export const AddAccountBookButton = () => {
  const { isShareUser, isLoading } = useUserInfo();

  if (isShareUser || isLoading) {
    return null;
  }

  return <AddButton href='/account-books/save' />;
};
