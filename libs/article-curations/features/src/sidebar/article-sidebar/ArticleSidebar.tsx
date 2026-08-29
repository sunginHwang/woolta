'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { usePathname } from 'next/navigation';
import { FiList, FiStar } from 'react-icons/fi';
import { useArticleCounts } from '../../_shared/hooks/useArticleCounts';
import { useCategoryList } from '../../_shared/hooks/useCategoryList';
import { getArticleListHref, isArticleListActive } from '../../_shared/routes';
import { CategoryAddForm } from './components/CategoryAddForm';
import { CategoryItem } from './components/CategoryItem';
import { SidebarItem } from './components/SidebarItem';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingBlock: '1.6rem',
    paddingInline: '1.2rem',
    overflowY: 'auto',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    listStyle: 'none',
    marginTop: 0,
    marginBottom: '1.6rem',
    marginInline: 0,
    padding: 0,
  },
  sectionTitle: {
    paddingTop: 0,
    paddingBottom: '0.6rem',
    paddingInline: '1rem',
  },
});

/** 아티클 앱 사이드바 — 전체 아티클 / 주간 큐레이션 / 카테고리 */
export const ArticleSidebar = () => {
  const pathname = usePathname();
  const categoryList = useCategoryList();
  const counts = useArticleCounts();

  return (
    <div {...stylex.props(styles.container)}>
      <ul {...stylex.props(styles.section)}>
        <SidebarItem
          href={getArticleListHref('all')}
          icon={<FiList size={14} />}
          label='전체 아티클'
          count={counts.all}
          isActive={isArticleListActive('all', pathname)}
        />
        <SidebarItem
          href={getArticleListHref('curation')}
          icon={<FiStar size={14} />}
          label='주간 큐레이션'
          count={counts.curation}
          isActive={isArticleListActive('curation', pathname)}
        />
      </ul>

      <ul {...stylex.props(styles.section)}>
        <li {...stylex.props(styles.sectionTitle)}>
          <Text variant='small1Bold' color='textTertiary'>
            카테고리
          </Text>
        </li>
        {categoryList.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            count={counts.byCategory[category.id] ?? 0}
            pathname={pathname}
          />
        ))}
        <CategoryAddForm />
      </ul>
    </div>
  );
};
