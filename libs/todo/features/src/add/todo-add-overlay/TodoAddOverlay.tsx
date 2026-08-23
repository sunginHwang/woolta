'use client';

import { AnimatePresence, motion } from 'motion/react';
import { MouseEvent } from 'react';
import { styled } from 'styled-components';
import { TodoListKey } from '../../_shared/types';
import { TodoAddInput } from '../todo-add-input/TodoAddInput';
import { useTodoAddShortcut } from './hooks/useTodoAddShortcut';

/** 등장 애니메이션 — 아래에서 위로 올라오며 폭이 늘고 서서히 나타난다. */
const SHEET_MOTION = {
  initial: { opacity: 0, y: 24, width: '65%' },
  animate: { opacity: 1, y: 0, width: '100%' },
  exit: { opacity: 0, y: 24, width: '65%' },
  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
} as const;

interface Props {
  /** 현재 리스트 키 (기본 마감일/카테고리 결정에 사용) */
  listKey: TodoListKey;
}

/**
 * Q 키로 열리는 할 일 추가 입력창.
 * 배경을 가리지 않고 입력창만 리스트 패널 상단 부근에 떠오른다.
 * 부모(리스트 패널)에 `position: relative` 가 필요하다.
 */
export const TodoAddOverlay = ({ listKey }: Props) => {
  const { isOpen, close } = useTodoAddShortcut();

  const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <SC.Layer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
        >
          <SC.SheetArea>
            <SC.Sheet {...SHEET_MOTION} onClick={handleSheetClick}>
              <TodoAddInput listKey={listKey} variant='overlay' autoFocus onSubmitted={close} />
            </SC.Sheet>
          </SC.SheetArea>
        </SC.Layer>
      )}
    </AnimatePresence>
  );
};

const SC = {
  /** 배경을 가리지 않는 투명 레이어. 바깥 클릭으로 닫기 위한 영역만 담당한다. */
  Layer: styled(motion.div)`
    position: absolute;
    inset: 0;
    background-color: transparent;
    z-index: ${({ theme }) => theme.zIndex.layer};
  `,
  /** 패널 높이의 25% 지점에 입력창을 배치한다. */
  SheetArea: styled.div`
    position: absolute;
    top: 25%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 0 2.4rem;
  `,
  Sheet: styled(motion.div)`
    max-width: 60rem;
    border-radius: 1.2rem;
    box-shadow: ${({ theme }) => theme.shadows.overlay};
  `,
};
