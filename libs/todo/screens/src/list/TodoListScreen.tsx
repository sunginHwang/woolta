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
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { Suspense } from 'react';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: TodoListKey;
}

/**
 * Todo 앱 가운데 패널 — 리스트 헤더 + 빠른 추가 + 리스트/칸반/미래 뷰.
 * 완료/휴지통에서는 빠른 추가와 뷰 전환을 숨기고, 미래 탭은 날짜 그룹 뷰만 노출한다.
 *
 * 헤더 제목·개수까지 조회 결과에서 나오므로 내용 전체를 하나의 경계로 감싼다.
 * 레이아웃이 프리페치하므로 첫 렌더에서 fallback 이 보이지는 않는다.
 */
export const TodoListScreen = ({ listKey }: Props) => {
  return (
    <div {...stylex.props(styles.panel)}>
      <Suspense
        fallback={
          <div {...stylex.props(styles.loading)}>
            <Text as='p' variant='body2' color='textTertiary'>
              할 일을 불러오는 중이에요
            </Text>
          </div>
        }
      >
        <TodoListContent listKey={listKey} />
      </Suspense>
    </div>
  );
};

const TodoListContent = ({ listKey }: Props) => {
  const { isMissingCategory, isTodoAddVisible } = useTodoBoardView(listKey);

  if (isMissingCategory) {
    return <TodoListEmpty />;
  }

  return (
    <>
      <TodoListHeader listKey={listKey} />
      {isTodoAddVisible && (
        <div {...stylex.props(styles.todoAddArea)}>
          <TodoAddInput listKey={listKey} />
        </div>
      )}
      {isTodoAddVisible && <TodoAddInput.Overlay listKey={listKey} />}
      <TodoListViewer listKey={listKey} />
    </>
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
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
