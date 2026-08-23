'use client';

import {
  TodoAddInput,
  TodoListEmpty,
  TodoListHeader,
  TodoListViewer,
  useTodoBoardView,
  type TodoListKey,
} from '@todo/features';
import { styled } from 'styled-components';

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
      <SC.Panel>
        <TodoListEmpty />
      </SC.Panel>
    );
  }

  return (
    <SC.Panel>
      <TodoListHeader listKey={listKey} />
      {isTodoAddVisible && (
        <SC.TodoAddArea>
          <TodoAddInput listKey={listKey} />
        </SC.TodoAddArea>
      )}
      {isTodoAddVisible && <TodoAddInput.Overlay listKey={listKey} />}
      <TodoListViewer listKey={listKey} />
    </SC.Panel>
  );
};

const SC = {
  Panel: styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.6rem;
    background-color: ${({ theme }) => theme.colors.bgPage};
  `,
  TodoAddArea: styled.div`
    padding-bottom: 1.2rem;
  `,
};
