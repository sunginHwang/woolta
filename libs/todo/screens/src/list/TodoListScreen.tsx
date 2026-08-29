'use client';

import * as stylex from '@stylexjs/stylex';
import {
  TodoAddInput,
  TodoListEmpty,
  TodoListHeader,
  type TodoListKey,
  TodoListViewer,
  useTodoBoardView,
} from '@todo/features';
import { colorVars } from '@wds/tokens.stylex';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: TodoListKey;
}

/**
 * Todo 앱 가운데 패널 — 리스트 헤더 + 빠른 추가 + 리스트/칸반/미래 뷰.
 * 완료/휴지통에서는 빠른 추가와 뷰 전환을 숨기고, 미래 탭은 날짜 그룹 뷰만 노출한다.
 */
export const TodoListScreen = ({ listKey }: Props) => {
  const { isMissingCategory, isTodoAddVisible } = useTodoBoardView(listKey);

  if (isMissingCategory) {
    return (
      <div {...stylex.props(styles.panel)}>
        <TodoListEmpty />
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.panel)}>
      <TodoListHeader listKey={listKey} />
      {isTodoAddVisible && (
        <div {...stylex.props(styles.todoAddArea)}>
          <TodoAddInput listKey={listKey} />
        </div>
      )}
      {isTodoAddVisible && <TodoAddInput.Overlay listKey={listKey} />}
      <TodoListViewer listKey={listKey} />
    </div>
  );
};

const styles = stylex.create({
  panel: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1.6rem',
    backgroundColor: colorVars['--color-bgPage'],
  },
  todoAddArea: {
    paddingBottom: '1.2rem',
  },
});
