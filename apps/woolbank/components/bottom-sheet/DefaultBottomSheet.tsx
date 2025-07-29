import { usePreventScroll } from '@common';
import { safeAreaInsetMarginBottom } from '@wds';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, PropsWithChildren } from 'react';
import { styled, useTheme } from 'styled-components';
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
  const {
    colors: { gray700 },
  } = useTheme();
  usePreventScroll(visible);

  return (
    <Deem visible={visible} onDeemClick={oncloseModal}>
      <AnimatePresence>
        {visible && (
          <SC.BottomModal
            as={motion.div}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {title && (
              <SC.Header>
                <p>{title}</p>
                {showCloseBtn && (
                  <i onClick={oncloseModal}>
                    <IconClose width={24} height={30} fill={gray700} />
                  </i>
                )}
              </SC.Header>
            )}
            <SC.Content $maxHeight={contentHeight}>{children}</SC.Content>
          </SC.BottomModal>
        )}
      </AnimatePresence>
    </Deem>
  );
};

const SC = {
  Header: styled.div`
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-weight: 500;
      color: ${({ theme }) => theme.colors.gray800};
    }
  `,
  Content: styled.div<{ $maxHeight?: number }>`
    margin-bottom: 2.5rem;
    max-height: ${({ $maxHeight }) => $maxHeight}rem;
    ${({ $maxHeight }) => $maxHeight && `max-height: ${$maxHeight / 10}rem;`}
    overflow-y: scroll;
  `,
  BottomModal: styled.div`
    position: fixed;
    width: 100%;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.white};
    z-index: ${({ theme }) => theme.zIndex.modalDeem + 1};
    box-shadow: 0.1rem 0.3rem 1rem 0.2rem rgba(0, 0, 0, 0.2);
    bottom: 0;

    > p {
      margin-left: 1rem;
      padding: 1.4rem;
      font-size: 1.6rem;
      font-weight: bold;
      color: ${({ theme }) => theme.colors.grayPrimary};
      text-align: left;
    }

    > p:last-child {
      ${safeAreaInsetMarginBottom('2.5rem')}
    }
  `,
};
