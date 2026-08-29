'use client';

import * as stylex from '@stylexjs/stylex';
import { shadowVars, zIndexConsts } from '@wds/tokens.stylex';
import { AnimatePresence, motion } from 'motion/react';
import { MouseEvent } from 'react';
import { ArticleAddForm } from './components/ArticleAddForm';

/** 등장 애니메이션 — 아래에서 위로 올라오며 서서히 나타난다. */
const SHEET_MOTION = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 24 },
  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
} as const;

interface Props {
  /** 오버레이 표시 여부 */
  isOpen: boolean;
  /** 미리 선택해 둘 카테고리 id (없으면 null) */
  defaultCategoryId: string | null;
  /** 닫기 요청 (바깥 클릭/취소/등록 완료) */
  onClose: () => void;
}

const styles = stylex.create({
  layer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'transparent',
    zIndex: zIndexConsts.layer,
  },
  sheetArea: {
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    paddingBlock: 0,
    paddingInline: '2.4rem',
  },
  sheet: {
    width: '100%',
    maxWidth: '48rem',
    borderRadius: '1.2rem',
    boxShadow: shadowVars['--shadow-overlay'],
  },
});

/**
 * 아티클 등록 오버레이. 리스트 패널 상단 부근에 등록 폼이 떠오른다.
 * 부모(리스트 패널)에 `position: relative` 가 필요하다.
 */
export const ArticleAddOverlay = ({ isOpen, defaultCategoryId, onClose }: Props) => {
  const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...stylex.props(styles.layer)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <div {...stylex.props(styles.sheetArea)}>
            <motion.div {...stylex.props(styles.sheet)} {...SHEET_MOTION} onClick={handleSheetClick}>
              <ArticleAddForm defaultCategoryId={defaultCategoryId} onClose={onClose} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
