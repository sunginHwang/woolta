'use client';
import { CompleteButton } from './CompleteButton';
import { ContentInfo } from './ContentInfo';
import { HeaderInfo } from './HeaderInfo';
import { TodoInfo } from './TodoInfo';

export const BucketListDetail = () => {
  return (
    <>
      <HeaderInfo />
      <ContentInfo />
      <TodoInfo />
      <CompleteButton />
    </>
  );
};
