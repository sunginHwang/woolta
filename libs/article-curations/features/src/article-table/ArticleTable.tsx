'use client';

import { Text } from '@wds';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { styled } from 'styled-components';
import { WEEKLY_CURATION_LIMIT } from '../_shared/constants';
import { useArticleList } from '../_shared/hooks/useArticleList';
import { useCategoryList } from '../_shared/hooks/useCategoryList';
import { getCategoryIdFromListKey } from '../_shared/routes';
import { ArticleListKey } from '../_shared/types';
import { ArticleAddOverlay } from '../article-add/ArticleAddOverlay';
import { ArticleRow } from './components/ArticleRow';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: ArticleListKey;
}

/** 아티클 테이블 — 리스트 헤더(제목/개수/등록 버튼) + 아티클 목록 테이블 + 등록 오버레이 */
export const ArticleTable = ({ listKey }: Props) => {
  const categoryList = useCategoryList();
  const articleList = useArticleList(listKey);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const categoryId = getCategoryIdFromListKey(listKey);
  const currentCategory = categoryId === null ? null : categoryList.find((category) => category.id === categoryId);
  const categoryNameById = new Map(categoryList.map((category) => [category.id, category.name]));

  const isCurationView = listKey === 'curation';
  const showCategoryColumn = categoryId === null;

  if (categoryId !== null && currentCategory === undefined) {
    return (
      <SC.Empty>
        <Text variant='body2' color='textTertiary'>
          존재하지 않는 카테고리예요.
        </Text>
      </SC.Empty>
    );
  }

  const title = isCurationView ? '주간 큐레이션' : currentCategory?.name ?? '전체 아티클';
  const countLabel = isCurationView ? `${articleList.length}/${WEEKLY_CURATION_LIMIT}` : `${articleList.length}개`;

  return (
    <SC.Container>
      <SC.Header>
        <SC.HeaderInfo>
          <Text as='h2' variant='title5Bold' color='textPrimary'>
            {title}
          </Text>
          <Text variant='small2Medium' color='textTertiary'>
            {countLabel}
          </Text>
        </SC.HeaderInfo>
        {!isCurationView && (
          <SC.AddButton type='button' onClick={() => setIsAddOpen(true)}>
            <FiPlus size={14} />
            아티클 등록
          </SC.AddButton>
        )}
      </SC.Header>

      {articleList.length === 0 ? (
        <SC.Empty>
          <Text variant='body2' color='textTertiary'>
            {isCurationView ? '이번 주 큐레이션한 아티클이 없어요.' : '아직 등록된 아티클이 없어요.'}
          </Text>
          <Text variant='small2Regular' color='textTertiary'>
            {isCurationView
              ? '아티클 리스트에서 별(★) 버튼으로 이번 주 아티클을 선정해 보세요.'
              : '등록 버튼을 눌러 첫 아티클을 추가해 보세요.'}
          </Text>
        </SC.Empty>
      ) : (
        <SC.TableWrapper>
          <SC.Table>
            <thead>
              <SC.HeadRow>
                <SC.HeadCell scope='col'>제목</SC.HeadCell>
                {showCategoryColumn && <SC.HeadCell scope='col'>카테고리</SC.HeadCell>}
                <SC.HeadCell scope='col'>등록일</SC.HeadCell>
                <SC.HeadCell scope='col' aria-label='액션' />
              </SC.HeadRow>
            </thead>
            <tbody>
              {articleList.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  categoryName={categoryNameById.get(article.categoryId)}
                  showCategory={showCategoryColumn}
                />
              ))}
            </tbody>
          </SC.Table>
        </SC.TableWrapper>
      )}

      <ArticleAddOverlay isOpen={isAddOpen} defaultCategoryId={categoryId} onClose={() => setIsAddOpen(false)} />
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  Header: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    padding-bottom: 1.6rem;
  `,
  HeaderInfo: styled.div`
    display: flex;
    align-items: baseline;
    gap: 0.8rem;
    min-width: 0;
  `,
  AddButton: styled.button`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 0.6rem;
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.interactivePrimary};
    color: ${({ theme }) => theme.colors.textInverse};
    font-size: 1.3rem;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.interactivePrimaryHover};
    }
  `,
  TableWrapper: styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  `,
  Table: styled.table`
    width: 100%;
    border-collapse: collapse;
  `,
  HeadRow: styled.tr`
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  `,
  HeadCell: styled.th`
    padding: 0.8rem 1.2rem;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 1.2rem;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
  `,
  Empty: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    flex: 1;
    padding: 4rem 1.6rem;
  `,
};
