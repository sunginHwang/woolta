import { styled, useTheme } from 'styled-components';
import { Text, typography } from '@wds';
import { FC, PropsWithChildren } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Deem from '../../atom/Deem';

interface Props extends PropsWithChildren {
  isOpen?: boolean;
  message: string;
  loading?: boolean;
  confirmMsg?: string;
  cancelMsg?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * 커스텀 Confirm 모달
 * @component
 */
const Confirm: FC<Props> = ({
  isOpen = false,
  message,
  loading = false,
  confirmMsg = '확인',
  cancelMsg = '취소',
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  const { colors } = useTheme();
  return (
    <Deem data-cy='confirmModal' visible={isOpen}>
      <S.ModalWrapper>
        <S.ConfirmModal>
          <S.Content>
            <Text variant='body3' color='gray700' as='p'>
              {message}
            </Text>
          </S.Content>
          <S.Footer>
            {loading && (
              <S.Loading>
                <ClipLoader size={20} color={colors.orangePrimary} />
              </S.Loading>
            )}
            {!loading && (
              <div className='buttons'>
                <S.Button data-cy='icoCancel' onClick={onCancel}>
                  {cancelMsg}
                </S.Button>
                <S.Button data-cy='icoConfirm' onClick={onConfirm}>
                  {confirmMsg}
                </S.Button>
              </div>
            )}
          </S.Footer>
        </S.ConfirmModal>
      </S.ModalWrapper>
    </Deem>
  );
};

const S = {
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
  Loading: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
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
    border-top: 0.1rem solid ${({ theme }) => theme.colors.gray150};

    .buttons {
      width: 100%;
      display: flex;
      & > * + * {
        border-left: 1px solid ${({ theme }) => theme.colors.gray150};
      }
    }
  `,
  Button: styled.button`
    ${typography.body2};
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.black};

    :last-child {
      color: ${({ theme }) => theme.colors.orangePrimary};
    }
  `,
};

export default Confirm;
