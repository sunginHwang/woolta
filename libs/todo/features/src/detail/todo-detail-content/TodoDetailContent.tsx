'use client';

import { useManualSave } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text, useConfirm } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { FiCheck, FiRotateCcw, FiTrash2, FiX } from 'react-icons/fi';
import { TodoCheckbox } from '../../_shared/components/TodoCheckbox';
import { useSelectedTodo } from '../../_shared/hooks/useSelectedTodo';
import { useTodoStore } from '../../_shared/stores/useTodoStore';
import type { Todo } from '../../_shared/types';
import { CategorySelect } from './components/CategorySelect';
import { DueDateField } from './components/DueDateField';
import { EmptyView } from './components/EmptyView';
import { Memo } from './components/Memo';
import { PrioritySelect } from './components/PrioritySelect';
import { Title } from './components/Title';
import { useTodoAutoSave } from './hooks/useTodoAutoSave';

/** 할 일 상세 패널. 선택된 항목이 없으면 빈 상태를 표시한다. */
export const TodoDetailContent = () => {
  const selectedTodo = useSelectedTodo();

  if (selectedTodo === null) {
    return <EmptyView />;
  }

  return <Content key={selectedTodo.id} todo={selectedTodo} />;
};

interface ContentProps {
  /** 선택된 할 일 */
  todo: Todo;
}

const Content = ({ todo }: ContentProps) => {
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const moveToTrash = useTodoStore((state) => state.moveToTrash);
  const { openConfirm } = useConfirm();
  const restoreTodo = useTodoStore((state) => state.restoreTodo);
  const deleteForever = useTodoStore((state) => state.deleteForever);
  const { saveTitle, saveMemo, flush } = useTodoAutoSave(todo.id);
  const { isJustSaved } = useManualSave(flush);

  const isTrashed = todo.deletedAt !== null;

  const handleDeleteForeverClick = () => {
    if (window.confirm('할 일을 영구 삭제할까요?')) {
      deleteForever(todo.id);
    }
  };

  const handleTrashClick = async () => {
    const isConfirm = await openConfirm({ message: `'${todo.title}' 할 일을 삭제할까요?` });
    if (isConfirm) {
      moveToTrash(todo.id);
    }
  };

  return (
    <div {...stylex.props(styles.container)}>
      {isTrashed && (
        <div {...stylex.props(styles.trashBanner)}>
          <Text variant='small1Regular' color='textSecondary'>
            휴지통에 있는 할 일이에요
          </Text>
        </div>
      )}
      <div {...stylex.props(styles.toolbar)}>
        <TodoCheckbox isCompleted={todo.isCompleted} onCheckClick={() => toggleComplete(todo.id)} />
        <DueDateField dueDate={todo.dueDate} onDueDateChange={(dueDate) => updateTodo(todo.id, { dueDate })} />
        <div {...stylex.props(styles.toolbarSpacer)} />
        {!isTrashed && isJustSaved && (
          <span {...stylex.props(styles.savedIndicator)}>
            <FiCheck size={12} />
            저장됨
          </span>
        )}
        <PrioritySelect priority={todo.priority} onPriorityChange={(priority) => updateTodo(todo.id, { priority })} />
      </div>
      <Title title={todo.title} readOnly={isTrashed} isCompleted={todo.isCompleted} onTitleChange={saveTitle} />
      <Memo memo={todo.memo} readOnly={isTrashed} onMemoChange={saveMemo} />
      <div {...stylex.props(styles.footer)}>
        <CategorySelect
          categoryId={todo.categoryId}
          onCategoryChange={(categoryId) => updateTodo(todo.id, { categoryId })}
        />
        <div {...stylex.props(styles.footerSpacer)} />
        {isTrashed ? (
          <>
            <button
              type='button'
              title='복원'
              onClick={() => restoreTodo(todo.id)}
              {...stylex.props(styles.footerButton)}
            >
              <FiRotateCcw size={14} />
            </button>
            <button
              type='button'
              title='영구 삭제'
              onClick={handleDeleteForeverClick}
              {...stylex.props(styles.footerButton, styles.footerButtonDanger)}
            >
              <FiX size={15} />
            </button>
          </>
        ) : (
          <button
            type='button'
            title='휴지통으로 이동'
            onClick={handleTrashClick}
            {...stylex.props(styles.footerButton, styles.footerButtonDanger)}
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingBlock: '1.6rem',
    paddingInline: '2rem',
  },
  trashBanner: {
    paddingBlock: '0.8rem',
    paddingInline: '1.2rem',
    marginBottom: '1.2rem',
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '1.2rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderFaint'],
  },
  toolbarSpacer: {
    flex: 1,
  },
  savedIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '1.1rem',
    lineHeight: '1.6rem',
    color: colorVars['--color-statusSuccess'],
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    paddingTop: '1.2rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-borderFaint'],
  },
  footerSpacer: {
    flex: 1,
  },
  footerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    borderWidth: 0,
    borderRadius: '0.6rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    cursor: 'pointer',
  },
  footerButtonDanger: {
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
  },
});
