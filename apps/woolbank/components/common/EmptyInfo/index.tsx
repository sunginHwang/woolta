import { styled } from 'styled-components';
import { Text } from '@wds';
import Image from 'next/image';
import { FC } from 'react';
import noData from './images/no_data.svg';

interface Props {
  msg: string;
}

/**
 * 데이터 없는 경우 노출 영역
 * @component
 */

const EmptyData: FC<Props> = ({ msg }) => {
  return (
    <SC.EmptyData>
      <Image src={noData} alt='emptyDataImg' style={{ width: '60%', margin: '4rem 0', height: 'auto' }} />
      <Text variant='body1' color='grayInactive' as='p' alignment='center'>
        {msg}
      </Text>
    </SC.EmptyData>
  );
};

export default EmptyData;

const SC = {
  EmptyData: styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    p {
      padding-left: 2rem;
      padding-right: 2rem;
      margin-top: 2rem;
    }
  `,
};
