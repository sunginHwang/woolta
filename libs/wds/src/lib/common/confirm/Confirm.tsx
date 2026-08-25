'use client';

import { styled } from 'styled-components';
import { Text } from '../../atom/Text';
import { typography } from '../../style/font';

interface Props {
  /** 모달 표시 여부 */
  isOpen?: boolean;
  /** 확인 메시지 */
  message: string;
  /** 처리 중 여부 — true 면 버튼 대신 진행 문구를 표시한다 */
  loading?: boolean;
  /**
   * 확인 버튼 문구
   * @default '확인'
   */
  confirmMsg?: string;
  /**
   * 취소 버튼 문구
   * @default '취소'
   */
  cancelMsg?: string;
  /** 확인 클릭 시 호출 */
  onConfirm?: () => void;
  /** 취소 클릭 시 호출 */
  onCancel?: () => void;
}

/**
 * WDS 공용 Confirm 모달. ConfirmProvider 를 통해 사용한다.
 */
export const Confirm = ({
  isOpen = false,
  message,
  loading = false,
  confirmMsg = '확인',
  cancelMsg = '취소',
  onConfirm,
  onCancel,
}: Props) => {
  if (!isOpen) {
    return null;
  }

  return (
    <SC.Overlay data-cy='confirmModal'>
      <SC.Modal>
        <SC.Content>
          <Text variant='body3' color='textPrimary' as='p'>
            {message}
          </Text>
        </SC.Content>
        <SC.Footer>
          {loading ? (
            <SC.Loading>
              <Text variant='body3' color='textTertiary'>
                처리 중...
              </Text>
            </SC.Loading>
          ) : (
            <div className='buttons'>
              <SC.Button type='button' data-cy='icoCancel' onClick={onCancel}>
                {cancelMsg}
              </SC.Button>
              <SC.Button type='button' data-cy='icoConfirm' onClick={onConfirm}>
                {confirmMsg}
              </SC.Button>
            </div>
          )}
        </SC.Footer>
      </SC.Modal>
    </SC.Overlay>
  );
};

const SC = {
  Overlay: styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.bgOverlay};
    z-index: ${({ theme }) => theme.zIndex.modalDeem};
  `,
  Modal: styled.div`
    width: 80%;
    max-width: 40rem;
    border-radius: 0.8rem;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.35);
  `,
  Content: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem 0;

    p {
      padding: 0 2rem;
    }
  `,
  Footer: styled.div`
    display: flex;
    justify-content: space-between;
    height: 5.5rem;
    border-top: 0.1rem solid ${({ theme }) => theme.colors.borderSubtle};

    .buttons {
      width: 100%;
      display: flex;

      & > * + * {
        border-left: 1px solid ${({ theme }) => theme.colors.borderSubtle};
      }
    }
  `,
  Loading: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  `,
  Button: styled.button`
    ${typography.body2};
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.textPrimary};

    :last-child {
      color: ${({ theme }) => theme.colors.interactivePrimary};
    }
  `,
};
