'use client';

import { Text } from '@wds';
import { usePathname } from 'next/navigation';
import { FiList, FiStar } from 'react-icons/fi';
import { styled } from 'styled-components';
import { useArticleCounts } from '../../_shared/hooks/useArticleCounts';
import { useCategoryList } from '../../_shared/hooks/useCategoryList';
import { getArticleListHref, isArticleListActive } from '../../_shared/routes';
import { CategoryAddForm } from './components/CategoryAddForm';
import { CategoryItem } from './components/CategoryItem';
import { SidebarItem } from './components/SidebarItem';

/** 아티클 앱 사이드바 — 전체 아티클 / 주간 큐레이션 / 카테고리 */
export const ArticleSidebar = () => {
  const pathname = usePathname();
  const categoryList = useCategoryList();
  const counts = useArticleCounts();

  return (
    <SC.Container>
      <SC.Section>
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
      </SC.Section>

      <SC.Section>
        <SC.SectionTitle>
          <Text variant='small1Bold' color='textTertiary'>
            카테고리
          </Text>
        </SC.SectionTitle>
        {categoryList.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            count={counts.byCategory[category.id] ?? 0}
            pathname={pathname}
          />
        ))}
        <CategoryAddForm />
      </SC.Section>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.6rem 1.2rem;
    overflow-y: auto;
  `,
  Section: styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    list-style: none;
    margin: 0 0 1.6rem;
    padding: 0;
  `,
  SectionTitle: styled.li`
    padding: 0 1rem 0.6rem;
  `,
};
