import { SkeletonBar } from '@wds';
import { FC } from 'react';
import { ChipLayout } from './ChipLayout';

interface Props {
  /**
   * stickey 처리가 필요한 경우 stickey 할 만큼의  height를 정의합니다.
   */
  stickey_height?: number;
  /**
   * padding 여백을 설정 합니다.
   * @default 0.8rem 1rem;
   */
  padding?: string;
}

export const ChipsLoading: FC<Pick<Props, 'padding' | 'stickey_height'>> = ({ padding = '.8rem 1rem', stickey_height }) => {
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
