import { colors, Text } from '@wds';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { IconChevronRight } from '../../../../../components/atom/Icon/ChevronRight';

interface Props {
  title: string;
  onClick?: () => void;
  children?: ReactNode;
}

export const FormField: FC<Props> = ({ title, onClick, children }) => {
  return (
    <SC.FormLabel onClick={onClick}>
      <Text className='label' variant='body3' color='gray600'>
        {title}
      </Text>
      <div className='info'>
        <div className='item'>{children}</div>
      </div>
    </SC.FormLabel>
  );
};
const SC = {
  FormLabel: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray300};
    height: 5.2rem;

    .label {
      width: 12rem;
    }

    .info {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .item {
        flex: 1;
      }
    }
  `,
};
