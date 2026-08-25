'use client';

import { SyntheticEvent } from 'react';
import { FiLink, FiStar, FiTrash2 } from 'react-icons/fi';
import { styled } from 'styled-components';
import { useWeeklyCuration } from '../../_shared/hooks/useWeeklyCuration';
import { useArticleStore } from '../../_shared/stores/useArticleStore';
import { Article } from '../../_shared/types';
import { formatArticleDate } from '../../_shared/utils/formatArticleDate';

interface Props {
  /** 표시할 아티클 */
  article: Article;
  /** 카테고리 컬럼에 표시할 카테고리 이름 */
  categoryName?: string;
  /** 카테고리 컬럼 노출 여부 (전체/큐레이션 뷰에서만 노출) */
  showCategory: boolean;
}

/** 아티클 테이블 행 — 제목 링크 / 카테고리 / 등록일 / 큐레이션 토글 / 삭제 */
export const ArticleRow = ({ article, categoryName, showCategory }: Props) => {
  const removeArticle = useArticleStore((state) => state.removeArticle);
  const toggleCuration = useArticleStore((state) => state.toggleCuration);
  const { weekKey, curatedArticleIds, isFull } = useWeeklyCuration();

  const isCurated = curatedArticleIds.includes(article.id);
  const isCurationDisabled = !isCurated && isFull;

  const handleCurationClick = () => {
    toggleCuration(weekKey, article.id);
  };

  const handleThumbnailError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const handleRemoveClick = () => {
    if (!window.confirm(`'${article.title}' 아티클을 삭제할까요?`)) {
      return;
    }
    removeArticle(article.id);
  };

  return (
    <SC.Row>
      <SC.TitleCell>
        <SC.TitleWrap>
          {article.seo?.imageUrl ? (
            <SC.Thumbnail src={article.seo.imageUrl} alt='' loading='lazy' onError={handleThumbnailError} />
          ) : (
            <SC.ThumbnailFallback>
              <FiLink size={14} />
            </SC.ThumbnailFallback>
          )}
          <SC.TitleBody>
            <SC.TitleLink href={article.url} target='_blank' rel='noreferrer' title={article.url}>
              {article.title}
            </SC.TitleLink>
            {article.seo?.description && <SC.Description title={article.seo.description}>{article.seo.description}</SC.Description>}
          </SC.TitleBody>
        </SC.TitleWrap>
      </SC.TitleCell>
      {showCategory && <SC.Cell>{categoryName ?? '-'}</SC.Cell>}
      <SC.Cell>{formatArticleDate(article.createdAt)}</SC.Cell>
      <SC.ActionCell>
        <SC.CurationButton
          type='button'
          $isCurated={isCurated}
          disabled={isCurationDisabled}
          title={isCurationDisabled ? '이번 주 큐레이션이 가득 찼어요' : '이번 주 큐레이션 토글'}
          onClick={handleCurationClick}
        >
          <FiStar size={14} />
        </SC.CurationButton>
        <SC.RemoveButton type='button' title='삭제' className='article-row-remove' onClick={handleRemoveClick}>
          <FiTrash2 size={14} />
        </SC.RemoveButton>
      </SC.ActionCell>
    </SC.Row>
  );
};

const SC = {
  Row: styled.tr`
    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }

    &:hover .article-row-remove {
      opacity: 1;
    }
  `,
  TitleCell: styled.td`
    padding: 1rem 1.2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
    max-width: 0;
    width: 100%;
  `,
  TitleWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  `,
  Thumbnail: styled.img`
    flex-shrink: 0;
    width: 5.6rem;
    height: 3.6rem;
    object-fit: cover;
    border-radius: 0.6rem;
    border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
  `,
  ThumbnailFallback: styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 5.6rem;
    height: 3.6rem;
    border-radius: 0.6rem;
    border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    color: ${({ theme }) => theme.colors.textTertiary};
  `,
  TitleBody: styled.div`
    min-width: 0;
  `,
  TitleLink: styled.a`
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.3rem;
    line-height: 1.8rem;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.brandPrimary};
      text-decoration: underline;
    }
  `,
  Description: styled.p`
    margin-top: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 1.2rem;
    line-height: 1.6rem;
  `,
  Cell: styled.td`
    padding: 1rem 1.2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.2rem;
    white-space: nowrap;
  `,
  ActionCell: styled.td`
    padding: 1rem 1.2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
    white-space: nowrap;
  `,
  CurationButton: styled.button<{ $isCurated: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border: none;
    border-radius: 0.4rem;
    background: none;
    color: ${({ theme, $isCurated }) => ($isCurated ? theme.colors.brandPrimary : theme.colors.textTertiary)};
    cursor: pointer;

    svg {
      fill: ${({ $isCurated }) => ($isCurated ? 'currentColor' : 'none')};
    }

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.brandPrimary};
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
  RemoveButton: styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.4rem;
    padding: 0.3rem;
    border: none;
    border-radius: 0.4rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    opacity: 0;
    transition: opacity 0.15s ease;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.statusError};
    }
  `,
};
