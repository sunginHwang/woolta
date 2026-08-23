import { Text } from '@wds';
import { FiCheckSquare } from 'react-icons/fi';
import { styled } from 'styled-components';

export const EmptyView = () => {
  return (
    <SC.Empty>
      <FiCheckSquare size={28} />
      <Text as='p' variant='body3' color='textTertiary' alignment='center'>
        할 일을 선택하면
        <br />
        상세 내용이 표시돼요
      </Text>
    </SC.Empty>
  );
};

const SC = {
  Empty: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    height: 100%;
    color: ${({ theme }) => theme.colors.textDisabled};
  `,
};
