'use client';

import { usePreventScroll } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { AnimatePresence, motion } from 'motion/react';
import type { PropsWithChildren, ReactNode } from 'react';
import Deem from '../components/deem/Deem';
import { IconClose } from '../icons';

interface Props extends PropsWithChildren {
  title?: string;
  visible?: boolean;
  contentHeight?: number;
  showCloseBtn?: boolean;
  children?: ReactNode;
  oncloseModal?: () => void;
}

const dynamicStyles = stylex.create({
  contentMaxHeight: (maxHeight: number) => ({
    maxHeight: `${maxHeight / 10}rem`,
  }),
});

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
            {...stylex.props(styles.bottomModal)}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {title && (
              <div {...stylex.props(styles.header)}>
                <p {...stylex.props(styles.headerTitle)}>{title}</p>
                {showCloseBtn && (
                  <i onClick={oncloseModal}>
                    <IconClose width={24} height={30} fill={colorVars['--color-gray700']} />
                  </i>
                )}
              </div>
            )}
            <div
              {...stylex.props(
                styles.content,
                contentHeight !== undefined && dynamicStyles.contentMaxHeight(contentHeight),
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

const styles = stylex.create({
  bottomModal: {
    position: 'fixed',
    width: '100%',
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    textAlign: 'center',
    backgroundColor: colorVars['--color-white'],
    zIndex: zIndexConsts.modalDeem,
    boxShadow: '0.1rem 0.3rem 1rem 0.2rem rgba(0, 0, 0, 0.2)',
    bottom: 0,
  },
  header: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 500,
    color: colorVars['--color-textPrimary'],
  },
  content: {
    marginBottom: '2.5rem',
    overflowY: 'scroll',
  },
});
