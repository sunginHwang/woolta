'use client';

import { useTodoBoardView, useTodoDetailVisibility, type TodoListKey } from '@todo/features';
import { Text } from '@wds';
import { FiColumns, FiList, FiSidebar } from 'react-icons/fi';
import { styled } from 'styled-components';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: TodoListKey;
}

export const TodoListHeader = ({ listKey }: Props) => {
  const { listTitle, viewMode, setViewMode, isViewToggleVisible } = useTodoBoardView(listKey);
  const { isDetailVisible, toggleDetail } = useTodoDetailVisibility();

  return (
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
  );
};

const SC = {
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
};
