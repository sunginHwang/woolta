'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';

interface Props {
  onClick: () => void;
  onPrevMonthClick?: () => void;
  onNextMonthClick?: () => void;
  title: string;
}

/**
 * 제목 + 드랍다운 아이콘
 * @component
 */
export const DropdownTitle = ({ title, onClick, onPrevMonthClick, onNextMonthClick }: Props) => {
  return (
    <div {...stylex.props(styles.title)}>
      <Text onClick={onPrevMonthClick} variant='small3Regular' color='grayPrimary' as='p'>
        ◀
      </Text>
      <Text onClick={onClick} variant='title2Bold' color='grayPrimary' as='p'>
        {title}
      </Text>
      <Text onClick={onNextMonthClick} variant='small3Regular' color='grayPrimary' as='p'>
        ▶
      </Text>
    </div>
  );
};

const styles = stylex.create({
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
});
