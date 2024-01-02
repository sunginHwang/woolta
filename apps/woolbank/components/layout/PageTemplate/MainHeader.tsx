import React from 'react';
import styled from 'styled-components';

import banketList from '@/image/banket_list.svg';

/**
 * 메인페이지 헤더 영역
 * @component
 */

function MainHeader() {
  return (
    <S.MainHeader>
      <img src={banketList} alt='메인 로고' />
    </S.MainHeader>
  );
}

const S: {
  MainHeader: any;
} = {
  MainHeader: styled.div`
    height: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.white};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: ${({ theme }) => theme.zIndex.header};
    padding: env(safe-area-inset-top, 0.6rem) 0 0.6rem 0;
    padding: 0.6rem 0;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.greyL2};

    img {
      height: 3rem;
    }
  `
};

export default MainHeader;
