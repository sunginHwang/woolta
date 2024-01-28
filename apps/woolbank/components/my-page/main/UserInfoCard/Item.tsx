import { styled } from 'styled-components';
import { Text } from '@wds';
import { FC } from 'react';

interface Props {
  title: string;
  onClick: () => void;
}

const Item: FC<Props> = ({ title, onClick }) => {
  return (
    <SC.Container onClick={onClick}>
      <SC.DefaultItem>
        <Text variant='small4Medium' color='grayPrimary'>
          {title}
        </Text>
        <Text variant='small4Medium' color='grayPrimary'>
          &gt;
        </Text>
      </SC.DefaultItem>
    </SC.Container>
  );
};

export default Item;

const SC = {
  Container: styled.div`
    border-top: 0.1rem solid #f2f2f2;
    height: 4.8rem;
    display: flex;
    padding: 0 2rem;
  `,
  DefaultItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  `,
};
