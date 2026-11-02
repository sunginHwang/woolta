import { usePreventScroll } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { AnimatePresence, motion } from 'motion/react';
import type { PropsWithChildren, ReactNode } from 'react';
import Deem from '../atom/Deem';
import { IconClose } from '../atom/Icon';

interface Props extends PropsWithChildren {
  title?: string;
  visible?: boolean;
  contentHeight?: number;
  showCloseBtn?: boolean;
  children?: ReactNode;
  oncloseModal?: () => void;
}

export const DefaultBottomSheet = ({
  visible = false,
  title,
  contentHeight,
  showCloseBtn = true,
  children,
  oncloseModal,
}: Props) => {
  usePreventScroll(visible);

  return (
    <Deem visible={visible} onDeemClick={oncloseModal}>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            {...stylex.props(styles.bottomModal)}
          >
            {title && (
              <div {...stylex.props(styles.header)}>
                <p {...stylex.props(styles.headerTitle)}>{title}</p>
                {showCloseBtn && (
                  <i onClick={() => oncloseModal?.()}>
                    <IconClose width={24} height={30} fill='#6D6D6D' />
                  </i>
                )}
              </div>
            )}
            <div
              {...stylex.props(
                styles.content,
                contentHeight !== undefined ? dynamicStyles.maxHeight(contentHeight) : null,
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Deem>
  );
};

const dynamicStyles = stylex.create({
  maxHeight: (height: number) => ({ maxHeight: `${height / 10}rem` }),
});

const styles = stylex.create({
  header: {
    paddingBlock: '2rem',
    paddingInline: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 500,
    color: colorVars['--color-gray800'],
  },
  // 시트는 뷰포트의 85% 까지만 자라고, 넘치는 목록은 content 안에서 스크롤한다.
  // 상한이 없으면 항목이 많은 메뉴(월 선택 60개 등)가 화면 위로 넘어가고,
  // 본문 스크롤은 usePreventScroll 로 잠겨 있어 어디서도 스크롤할 수 없다.
  content: {
    marginBottom: '2.5rem',
    overflowY: 'auto',
    minHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  bottomModal: {
    position: 'fixed',
    width: '100%',
    maxHeight: '85dvh',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    textAlign: 'center',
    backgroundColor: colorVars['--color-white'],
    zIndex: '501',
    boxShadow: '0.1rem 0.3rem 1rem 0.2rem rgba(0, 0, 0, 0.2)',
    bottom: 0,
  },
});
