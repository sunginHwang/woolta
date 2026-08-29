'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { usePathname } from 'next/navigation';
import { FiCalendar, FiCheckCircle, FiInbox, FiSun, FiTrash2 } from 'react-icons/fi';
import { useCategoryList } from '../../_shared/hooks/useCategoryList';
import { useTodoCounts } from '../../_shared/hooks/useTodoCounts';
import { getTodoListHref, isTodoListActive } from '../../_shared/routes';
import { CategoryAddForm } from './components/CategoryAddForm';
import { CategoryItem } from './components/CategoryItem';
import { SidebarItem } from './components/SidebarItem';

/** Todo 앱 사이드바 — 스마트 리스트 / 카테고리 / 완료 / 휴지통 */
export const TodoSidebar = () => {
  const pathname = usePathname();
  const categoryList = useCategoryList();
  const counts = useTodoCounts();

  return (
    <div {...stylex.props(styles.container)}>
      <ul {...stylex.props(styles.section)}>
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
      </ul>

      <ul {...stylex.props(styles.section)}>
        <li {...stylex.props(styles.sectionTitle)}>
          <Text variant='small1Bold' color='textTertiary'>
            리스트
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
      <div {...stylex.props(styles.spacer)} />
      <ul {...stylex.props(styles.section)}>
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
      </ul>
    </div>
  );
};

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
    marginInline: 0,
    marginBottom: '1.6rem',
    padding: 0,
  },
  sectionTitle: {
    paddingTop: 0,
    paddingInline: '1rem',
    paddingBottom: '0.6rem',
  },
  spacer: {
    flex: 1,
  },
});
