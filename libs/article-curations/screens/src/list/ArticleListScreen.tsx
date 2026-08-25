'use client';

import { ArticleTable, type ArticleListKey } from '@article-curations/features';
import { styled } from 'styled-components';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: ArticleListKey;
}

/**
 * 아티클 앱 우측 패널 — 리스트 헤더 + 아티클 테이블 + 등록 오버레이.
 * 등록 오버레이가 패널 기준으로 떠오르도록 `position: relative` 를 가진다.
 */
export const ArticleListScreen = ({ listKey }: Props) => {
  return (
    <SC.Panel>
      <ArticleTable listKey={listKey} />
    </SC.Panel>
  );
};

const SC = {
  Panel: styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.6rem;
    background-color: ${({ theme }) => theme.colors.bgPage};
  `,
};
