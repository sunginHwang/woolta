'use client';

import { Text } from '@wds';
import { usePathname } from 'next/navigation';
import { FiCalendar, FiCheckCircle, FiInbox, FiSun, FiTrash2 } from 'react-icons/fi';
import { styled } from 'styled-components';
import { useCategoryList } from '../_shared/hooks/useCategoryList';
import { useTodoCounts } from '../_shared/hooks/useTodoCounts';
import { getTodoListHref, isTodoListActive } from '../_shared/routes';
import { CategoryAddForm } from './components/CategoryAddForm';
import { CategoryItem } from './components/CategoryItem';
import { SidebarItem } from './components/SidebarItem';

/** Todo 앱 사이드바 — 스마트 리스트 / 카테고리 / 완료 / 휴지통 */
export const TodoSidebar = () => {
  const pathname = usePathname();
  const categoryList = useCategoryList();
  const counts = useTodoCounts();

  return (
    <SC.Container>
      <SC.Section>
        <SidebarItem
          href={getTodoListHref('today')}
          icon={<FiSun size={14} />}
          label='오늘'
          count={counts.today}
          isActive={isTodoListActive('today', pathname)}
        />
        <SidebarItem
          href={getTodoListHref('upcoming')}
          icon={<FiCalendar size={14} />}
          label='미래'
          count={counts.upcoming}
          isActive={isTodoListActive('upcoming', pathname)}
        />
        <SidebarItem
          href={getTodoListHref('inbox')}
          icon={<FiInbox size={14} />}
          label='기본함'
          count={counts.inbox}
          isActive={isTodoListActive('inbox', pathname)}
        />
      </SC.Section>

      <SC.Section>
        <SC.SectionTitle>
          <Text variant='small1Bold' color='textTertiary'>
            리스트
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

      <SC.Spacer />

      <SC.Section>
        <SidebarItem
          href={getTodoListHref('completed')}
          icon={<FiCheckCircle size={14} />}
          label='완료'
          count={counts.completed}
          isActive={isTodoListActive('completed', pathname)}
        />
        <SidebarItem
          href={getTodoListHref('trash')}
          icon={<FiTrash2 size={14} />}
          label='휴지통'
          count={counts.trash}
          isActive={isTodoListActive('trash', pathname)}
        />
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
  Spacer: styled.div`
    flex: 1;
  `,
};
