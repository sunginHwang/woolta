'use client';

import { AnimatePresence, motion } from 'motion/react';
import { MouseEvent } from 'react';
import { styled } from 'styled-components';
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
        <SC.Layer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <SC.SheetArea>
            <SC.Sheet {...SHEET_MOTION} onClick={handleSheetClick}>
              <ArticleAddForm defaultCategoryId={defaultCategoryId} onClose={onClose} />
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
  /** 패널 높이의 15% 지점에 폼을 배치한다. */
  SheetArea: styled.div`
    position: absolute;
    top: 15%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 0 2.4rem;
  `,
  Sheet: styled(motion.div)`
    width: 100%;
    max-width: 48rem;
    border-radius: 1.2rem;
    box-shadow: ${({ theme }) => theme.shadows.overlay};
  `,
};
