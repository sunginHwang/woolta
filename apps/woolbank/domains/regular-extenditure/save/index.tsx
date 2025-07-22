'use client';

import { DehydratedState, HydrationBoundary } from '@tanstack/react-query';
import { NextPage } from 'next';
import Header from '../../../components/Header';
import { useSaveRegularExtenditure } from './hooks/useSaveRegularExtenditure';
import { RegularExtenditureForm } from './RegularExtenditureForm';

export const RegularExtenditureSavePage: NextPage<{
  dehydratedState?: DehydratedState;
}> = ({ dehydratedState }) => {
  const { addRegularExpenditure } = useSaveRegularExtenditure();
  return (
    <HydrationBoundary state={dehydratedState}>
      <Header.Sub title='정기 지출 등록' />
      <RegularExtenditureForm submitForm={addRegularExpenditure} />
    </HydrationBoundary>
  );
};
