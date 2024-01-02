import styled from '@emotion/styled';
import { Text } from '@wds';
import { FC } from 'react';
import { IconChevronDown } from '../Icon';

interface Props {
  onClick: () => void;
  title: string;
}

/**
 * 제목 + 드랍다운 아이콘
 * @component
 */
const DropdownTitle: FC<Props> = ({ title, onClick }) => {
  return (
    <SC.Title onClick={onClick}>
      <Text variant='title2Bold' color='grayPrimary' as='p'>
        {title}
      </Text>
      <IconChevronDown width={30} height={30} />
    </SC.Title>
  );
};

const SC = {
  Title: styled.div`
    display: flex;
    align-items: center;
  `,
};

export default DropdownTitle;
