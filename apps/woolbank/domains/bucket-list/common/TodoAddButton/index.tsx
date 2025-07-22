import { ButtonHTMLAttributes, FC } from 'react';
import { ClipLoader } from 'react-spinners';
import styled, { useTheme } from 'styled-components';
import { IconPlus } from '../../../atom/Icon';

interface Props extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  isLoading?: boolean;
}

/**
 * todo 추가 버튼
 * @component
 */

export const TodoAddButton: FC<Props> = ({ isLoading = false, onClick }) => {
  const { colors } = useTheme();

  return (
    <SC.TodoAddButton
      onClick={(e) => {
        if (!isLoading && onClick) {
          onClick(e);
        }
      }}
    >
      {isLoading ? <ClipLoader color={colors.red500} size={20} /> : <IconPlus />}
    </SC.TodoAddButton>
  );
};

const SC = {
  TodoAddButton: styled.button`
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.1rem solid ${({ theme }) => theme.colors.red500};
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.red500};
  `,
};
