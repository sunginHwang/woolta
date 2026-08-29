'use client';

import * as stylex from '@stylexjs/stylex';
import { shadowVars, zIndexConsts } from '@wds/tokens.stylex';
import { AnimatePresence, motion } from 'motion/react';
import type { MouseEvent } from 'react';
import type { TodoListKey } from '../../../_shared/types';
import { useTodoAddShortcut } from '../../_shared/hooks/useTodoAddShortcut';
import { TodoAddInputRoot } from './TodoAddInputRoot';

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
 * Q 키로 열리는 할 일 추가 입력창. `TodoAddInput.Overlay` 로 사용한다.
 * 배경을 가리지 않고 입력창만 리스트 패널 상단 부근에 떠오른다.
 * 부모(리스트 패널)에 `position: relative` 가 필요하다.
 */
export const TodoAddInputOverlay = ({ listKey }: Props) => {
  const { isOpen, close } = useTodoAddShortcut();

  const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          {...stylex.props(styles.layer)}
        >
          <div {...stylex.props(styles.sheetArea)}>
            <motion.div {...SHEET_MOTION} onClick={handleSheetClick} {...stylex.props(styles.sheet)}>
              <TodoAddInputRoot listKey={listKey} variant='overlay' autoFocus onSubmitted={close} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles = stylex.create({
  /** 배경을 가리지 않는 투명 레이어. 바깥 클릭으로 닫기 위한 영역만 담당한다. */
  layer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'transparent',
    zIndex: zIndexConsts.layer,
  },
  /** 패널 높이의 25% 지점에 입력창을 배치한다. */
  sheetArea: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    paddingBlock: 0,
    paddingInline: '2.4rem',
  },
  sheet: {
    maxWidth: '60rem',
    borderRadius: '1.2rem',
    boxShadow: shadowVars['--shadow-overlay'],
  },
});
