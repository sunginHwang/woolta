'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
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

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.2rem',
    paddingBottom: '1.6rem',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.8rem',
    minWidth: 0,
  },
  addButton: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    gap: '0.6rem',
    paddingBlock: '0.7rem',
    paddingInline: '1.2rem',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
    },
    color: colorVars['--color-textInverse'],
    fontSize: '1.3rem',
    cursor: 'pointer',
  },
  tableWrapper: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headRow: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderDefault'],
  },
  headCell: {
    paddingBlock: '0.8rem',
    paddingInline: '1.2rem',
    color: colorVars['--color-textTertiary'],
    fontSize: '1.2rem',
    fontWeight: 600,
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    flex: 1,
    paddingBlock: '4rem',
    paddingInline: '1.6rem',
  },
});

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
      <div {...stylex.props(styles.empty)}>
        <Text variant='body2' color='textTertiary'>
          존재하지 않는 카테고리예요.
        </Text>
      </div>
    );
  }

  const title = isCurationView ? '주간 큐레이션' : currentCategory?.name ?? '전체 아티클';
  const countLabel = isCurationView ? `${articleList.length}/${WEEKLY_CURATION_LIMIT}` : `${articleList.length}개`;

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerInfo)}>
          <Text as='h2' variant='title5Bold' color='textPrimary'>
            {title}
          </Text>
          <Text variant='small2Medium' color='textTertiary'>
            {countLabel}
          </Text>
        </div>
        {!isCurationView && (
          <button type='button' {...stylex.props(styles.addButton)} onClick={() => setIsAddOpen(true)}>
            <FiPlus size={14} />
            아티클 등록
          </button>
        )}
      </div>

      {articleList.length === 0 ? (
        <div {...stylex.props(styles.empty)}>
          <Text variant='body2' color='textTertiary'>
            {isCurationView ? '이번 주 큐레이션한 아티클이 없어요.' : '아직 등록된 아티클이 없어요.'}
          </Text>
          <Text variant='small2Regular' color='textTertiary'>
            {isCurationView
              ? '아티클 리스트에서 별(★) 버튼으로 이번 주 아티클을 선정해 보세요.'
              : '등록 버튼을 눌러 첫 아티클을 추가해 보세요.'}
          </Text>
        </div>
      ) : (
        <div {...stylex.props(styles.tableWrapper)}>
          <table {...stylex.props(styles.table)}>
            <thead>
              <tr {...stylex.props(styles.headRow)}>
                <th {...stylex.props(styles.headCell)} scope='col'>제목</th>
                {showCategoryColumn && <th {...stylex.props(styles.headCell)} scope='col'>카테고리</th>}
                <th {...stylex.props(styles.headCell)} scope='col'>등록일</th>
                <th {...stylex.props(styles.headCell)} scope='col' aria-label='액션' />
              </tr>
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
          </table>
        </div>
      )}

      <ArticleAddOverlay isOpen={isAddOpen} defaultCategoryId={categoryId} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
