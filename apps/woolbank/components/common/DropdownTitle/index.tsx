import { Text } from '@wds';
import { FC } from 'react';
import { styled } from 'styled-components';

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
const DropdownTitle: FC<Props> = ({ title, onClick, onPrevMonthClick, onNextMonthClick }) => {
  return (
    <SC.Title onClick={onClick}>
      <Text onClick={onPrevMonthClick} variant='small3Regular' color='grayPrimary' as='p'>
        ◀
      </Text>
      <Text onClick={onClick} variant='title2Bold' color='grayPrimary' as='p'>
        {title}
      </Text>
      <Text onClick={onNextMonthClick} variant='small3Regular' color='grayPrimary' as='p'>
        ▶
      </Text>
    </SC.Title>
  );
};

const SC = {
  Title: styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;
  `,
};

export default DropdownTitle;
