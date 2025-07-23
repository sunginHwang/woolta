import { Text } from '@wds';
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
export const DropdownTitle = ({ title, onClick, onPrevMonthClick, onNextMonthClick }: Props) => {
  return (
    <SC.Title>
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
