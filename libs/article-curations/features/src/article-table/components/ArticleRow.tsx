'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { SyntheticEvent } from 'react';
import { FiLink, FiStar, FiTrash2 } from 'react-icons/fi';
import { useWeeklyCuration } from '../../_shared/hooks/useWeeklyCuration';
import { useArticleStore } from '../../_shared/stores/useArticleStore';
import type { Article } from '../../_shared/types';
import { formatArticleDate } from '../../_shared/utils/formatArticleDate';

interface Props {
  /** 표시할 아티클 */
  article: Article;
  /** 카테고리 컬럼에 표시할 카테고리 이름 */
  categoryName?: string;
  /** 카테고리 컬럼 노출 여부 (전체/큐레이션 뷰에서만 노출) */
  showCategory: boolean;
}

const styles = stylex.create({
  // CSS 변수로 자손 opacity 토글 — Row hover 시 RemoveButton 이 나타남
  row: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    '--article-remove-opacity': {
      default: '0',
      ':hover': '1',
    },
  },
  titleCell: {
    paddingBlock: '1rem',
    paddingInline: '1.2rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    maxWidth: 0,
    width: '100%',
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: 0,
  },
  thumbnail: {
    flexShrink: 0,
    width: '5.6rem',
    height: '3.6rem',
    objectFit: 'cover',
    borderRadius: '0.6rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  thumbnailFallback: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '5.6rem',
    height: '3.6rem',
    borderRadius: '0.6rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    color: colorVars['--color-textTertiary'],
  },
  titleBody: {
    minWidth: 0,
  },
  titleLink: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: {
      default: colorVars['--color-textPrimary'],
      ':hover': colorVars['--color-brandPrimary'],
    },
    fontSize: '1.3rem',
    lineHeight: '1.8rem',
    textDecoration: {
      default: 'none',
      ':hover': 'underline',
    },
  },
  description: {
    marginTop: '0.2rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: colorVars['--color-textTertiary'],
    fontSize: '1.2rem',
    lineHeight: '1.6rem',
  },
  cell: {
    paddingBlock: '1rem',
    paddingInline: '1.2rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    color: colorVars['--color-textSecondary'],
    fontSize: '1.2rem',
    whiteSpace: 'nowrap',
  },
  actionCell: {
    paddingBlock: '1rem',
    paddingInline: '1.2rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    whiteSpace: 'nowrap',
  },
  curationButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: '0.3rem',
    paddingInline: '0.3rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.4rem',
    background: 'none',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':disabled': 0.4,
    },
  },
  curationButtonCurated: {
    color: {
      default: colorVars['--color-brandPrimary'],
      ':hover:not(:disabled)': colorVars['--color-brandPrimary'],
    },
  },
  curationButtonDefault: {
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover:not(:disabled)': colorVars['--color-brandPrimary'],
    },
  },
  // opacity 는 CSS 변수로 제어 — 부모 row hover 시 '1' 로 전환됨
  removeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '0.4rem',
    paddingBlock: '0.3rem',
    paddingInline: '0.3rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.4rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
    opacity: 'var(--article-remove-opacity)' as unknown as number,
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    cursor: 'pointer',
  },
});

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
    <tr {...stylex.props(styles.row)}>
      <td {...stylex.props(styles.titleCell)}>
        <div {...stylex.props(styles.titleWrap)}>
          {article.seo?.imageUrl ? (
            <img
              {...stylex.props(styles.thumbnail)}
              src={article.seo.imageUrl}
              alt=''
              loading='lazy'
              onError={handleThumbnailError}
            />
          ) : (
            <span {...stylex.props(styles.thumbnailFallback)}>
              <FiLink size={14} />
            </span>
          )}
          <div {...stylex.props(styles.titleBody)}>
            <a
              {...stylex.props(styles.titleLink)}
              href={article.url}
              target='_blank'
              rel='noreferrer'
              title={article.url}
            >
              {article.title}
            </a>
            {article.seo?.description && (
              <p {...stylex.props(styles.description)} title={article.seo.description}>
                {article.seo.description}
              </p>
            )}
          </div>
        </div>
      </td>
      {showCategory && <td {...stylex.props(styles.cell)}>{categoryName ?? '-'}</td>}
      <td {...stylex.props(styles.cell)}>{formatArticleDate(article.createdAt)}</td>
      <td {...stylex.props(styles.actionCell)}>
        <button
          type='button'
          {...stylex.props(
            styles.curationButton,
            isCurated ? styles.curationButtonCurated : styles.curationButtonDefault,
          )}
          disabled={isCurationDisabled}
          title={isCurationDisabled ? '이번 주 큐레이션이 가득 찼어요' : '이번 주 큐레이션 토글'}
          onClick={handleCurationClick}
        >
          <FiStar size={14} fill={isCurated ? 'currentColor' : 'none'} />
        </button>
        <button type='button' {...stylex.props(styles.removeButton)} title='삭제' onClick={handleRemoveClick}>
          <FiTrash2 size={14} />
        </button>
      </td>
    </tr>
  );
};
