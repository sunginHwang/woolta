'use client';

import * as stylex from '@stylexjs/stylex';
import { useTodoBoardView, useTodoDetailVisibility, type TodoListKey } from '@todo/features';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { FiColumns, FiList, FiSidebar } from 'react-icons/fi';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: TodoListKey;
}

export const TodoListHeader = ({ listKey }: Props) => {
  const { listTitle, viewMode, setViewMode, isViewToggleVisible } = useTodoBoardView(listKey);
  const { isDetailVisible, toggleDetail } = useTodoDetailVisibility();

  return (
    <div {...stylex.props(styles.header)}>
      <Text as='h2' variant='title5Bold' color='textPrimary' xstyle={styles.title}>
        {listTitle}
      </Text>
      {isViewToggleVisible && (
        <div {...stylex.props(styles.viewToggle)}>
          <button
            type='button'
            title='리스트 뷰'
            onClick={() => setViewMode('list')}
            {...stylex.props(styles.viewButton, viewMode === 'list' && styles.viewButtonActive)}
          >
            <FiList size={14} />
          </button>
          <button
            type='button'
            title='칸반 뷰'
            onClick={() => setViewMode('kanban')}
            {...stylex.props(styles.viewButton, viewMode === 'kanban' && styles.viewButtonActive)}
          >
            <FiColumns size={14} />
          </button>
        </div>
      )}
      <button
        type='button'
        title={isDetailVisible ? '상세 보기 닫기' : '상세 보기 열기'}
        onClick={toggleDetail}
        {...stylex.props(styles.detailToggleButton, isDetailVisible && styles.detailToggleButtonActive)}
      >
        <FiSidebar size={14} />
      </button>
    </div>
  );
};

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingBottom: '1.2rem',
  },
  title: {
    flex: 1,
    minWidth: 0,
  },
  viewToggle: {
    display: 'inline-flex',
    gap: '0.2rem',
    padding: '0.2rem',
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  viewButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: '0.5rem',
    paddingInline: '0.8rem',
    borderWidth: 0,
    borderRadius: '0.6rem',
    backgroundColor: 'transparent',
    color: colorVars['--color-textTertiary'],
    cursor: 'pointer',
  },
  viewButtonActive: {
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
  },
  detailToggleButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '0.6rem',
    borderWidth: 0,
    borderRadius: '0.6rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    cursor: 'pointer',
  },
  detailToggleButtonActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    color: colorVars['--color-textPrimary'],
  },
});
