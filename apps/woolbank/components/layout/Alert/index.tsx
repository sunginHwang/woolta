import { useAtomValue } from 'jotai';
import React from 'react';
import styled from 'styled-components';
import { alertAtom } from '../../..//store/layout';
import { useAlert } from '../../../hooks/useAlert';
import Deem from '../../atom/Deem';

export const Alert = () => {
  const alertMessage = useAtomValue(alertAtom);
  const { offAlert } = useAlert();

  const isShowAlert = alertMessage !== '';

  return (
    <Deem visible={isShowAlert}>
      <SC.ModalWrapper>
        <SC.ConfirmModal>
          <SC.Content>
            <p>{alertMessage}</p>
          </SC.Content>
          <SC.Footer>
            <SC.Button onClick={offAlert}>확인</SC.Button>
          </SC.Footer>
        </SC.ConfirmModal>
      </SC.ModalWrapper>
    </Deem>
  );
};

const SC = {
  ConfirmModal: styled.div`
    width: 80%;
    max-width: 68rem;
    border-radius: 0.8rem;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.white};
    z-index: ${({ theme }) => theme.zIndex.modalDeem + 1};
    box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.35);
  `,
  ModalWrapper: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Content: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem 0;

    p {
      font-size: 1.4rem;
      padding: 0 2rem;
      color: ${({ theme }) => theme.colors.gray900};
    }
  `,
  Footer: styled.div`
    display: flex;
    height: 5rem;
    padding: 0 2rem 2rem 2rem;
    justify-content: center;
    align-items: center;
  `,
  Button: styled.button`
    width: 100%;
    font-size: 1.6rem;
    height: 100%;
    border-radius: 0.8rem;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.red500};
  `,
};
