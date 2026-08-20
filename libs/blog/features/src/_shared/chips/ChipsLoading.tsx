'use client';

import { SkeletonBar } from '@wds';
import { FC } from 'react';
import { ChipLayout } from './ChipLayout';

interface Props {
  stickey_height?: number;
  padding?: string;
}

export const ChipsLoading: FC<Props> = ({ padding = '.8rem 1rem', stickey_height }) => {
  return (
    <ChipLayout stickey_height={stickey_height} padding={padding}>
      {[47, 58, 46, 85, 47, 58].map((width, index) => (
        <li key={index}>
          <SkeletonBar width={`${width / 10}rem`} height='3.6rem' radius={18} />
        </li>
      ))}
    </ChipLayout>
  );
};