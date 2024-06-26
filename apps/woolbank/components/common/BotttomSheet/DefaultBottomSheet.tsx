import { usePreventScroll } from '@common';
import { safeAreaInsetMarginBottom } from '@wds';
import React, { FC, PropsWithChildren } from 'react';
import { styled, useTheme } from 'styled-components';
import Deem from '../../atom/Deem';
import { IconClose } from '../../atom/Icon';

interface Props extends PropsWithChildren {
  title?: string;
  visible: boolean;
  contentHeight?: number;
  showCloseBtn?: boolean;
  children: React.ReactNode;
  oncloseModal: () => void;
}

const DefaultBottomSheet: FC<Props> = ({
  visible,
  title,
  contentHeight = 270,
  showCloseBtn = true,
  children,
  oncloseModal,
}) => {
  const {
    colors: { gray700 },
  } = useTheme();
  usePreventScroll(visible);

  return (
    <Deem visible={visible} onDeemClick={oncloseModal}>
      <SC.BottomModal $isActive={visible}>
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
        <SC.Content $maxHeight={contentHeight / 10}>{children}</SC.Content>
      </SC.BottomModal>
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
  Content: styled.div<{ $maxHeight: number }>`
    margin-bottom: 2.5rem;
    max-height: ${({ $maxHeight }) => $maxHeight}rem;
    overflow-y: scroll;
  `,
  BottomModal: styled.div<{ $isActive: boolean }>`
    position: fixed;
    width: 100%;
    transition: all 0.3s ease;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    text-align: center;
    transform: translateY(${({ $isActive }) => ($isActive ? '0' : '40rem')});
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

export default DefaultBottomSheet;
