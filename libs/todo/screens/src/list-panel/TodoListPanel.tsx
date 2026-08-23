'use client';

import {
  TodoAddInput,
  TodoAddOverlay,
  TodoKanbanView,
  TodoListView,
  TodoUpcomingView,
  useTodoBoardView,
  useTodoDetailVisibility,
  type TodoListKey,
} from '@todo/features';
import { Text } from '@wds';
import { FiColumns, FiList, FiSidebar } from 'react-icons/fi';
import { styled } from 'styled-components';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: TodoListKey;
}

/**
 * Todo 앱 가운데 패널 — 리스트 헤더 + 빠른 추가 + 리스트/칸반/미래 뷰.
 * 완료/휴지통에서는 빠른 추가와 뷰 전환을 숨기고, 미래 탭은 날짜 그룹 뷰만 노출한다.
 */
export const TodoListPanel = ({ listKey }: Props) => {
  const { listTitle, isMissingCategory, isUpcoming, viewMode, setViewMode, isTodoAddVisible, isViewToggleVisible } =
    useTodoBoardView(listKey);
  const { isDetailVisible, toggleDetail } = useTodoDetailVisibility();

  if (isMissingCategory) {
    return (
      <SC.Panel>
        <SC.Empty>
          <Text as='p' variant='body3' color='textTertiary' alignment='center'>
            리스트를 찾을 수 없어요
          </Text>
        </SC.Empty>
      </SC.Panel>
    );
  }

  const isKanban = viewMode === 'kanban' && isViewToggleVisible;

  return (
    <SC.Panel>
      <SC.Header>
        <Text as='h2' variant='title5Bold' color='textPrimary'>
          {listTitle}
        </Text>
        {isViewToggleVisible && (
          <SC.ViewToggle>
            <SC.ViewButton
              type='button'
              title='리스트 뷰'
              $isActive={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <FiList size={14} />
            </SC.ViewButton>
            <SC.ViewButton
              type='button'
              title='칸반 뷰'
              $isActive={viewMode === 'kanban'}
              onClick={() => setViewMode('kanban')}
            >
              <FiColumns size={14} />
            </SC.ViewButton>
          </SC.ViewToggle>
        )}
        <SC.DetailToggleButton
          type='button'
          title={isDetailVisible ? '상세 보기 닫기' : '상세 보기 열기'}
          $isActive={isDetailVisible}
          onClick={toggleDetail}
        >
          <FiSidebar size={14} />
        </SC.DetailToggleButton>
      </SC.Header>
      {isTodoAddVisible && (
        <SC.TodoAddArea>
          <TodoAddInput listKey={listKey} />
        </SC.TodoAddArea>
      )}
      {isTodoAddVisible && <TodoAddOverlay listKey={listKey} />}
      {isUpcoming && <TodoUpcomingView />}
      {!isUpcoming && (isKanban ? <TodoKanbanView listKey={listKey} /> : <TodoListView listKey={listKey} />)}
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
  Header: styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding-bottom: 1.2rem;

    /* 제목이 남는 공간을 차지하고 버튼들은 우측에 붙는다 */
    & > h2 {
      flex: 1;
      min-width: 0;
    }
  `,
  ViewToggle: styled.div`
    display: inline-flex;
    gap: 0.2rem;
    padding: 0.2rem;
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
  `,
  ViewButton: styled.button<{ $isActive: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.8rem;
    border: none;
    border-radius: 0.6rem;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurface : 'transparent')};
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.textPrimary : theme.colors.textTertiary)};
    cursor: pointer;
  `,
  DetailToggleButton: styled.button<{ $isActive: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0.6rem;
    border: none;
    border-radius: 0.6rem;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.textPrimary : theme.colors.textTertiary)};
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
  TodoAddArea: styled.div`
    padding-bottom: 1.2rem;
  `,
  Empty: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  `,
};
