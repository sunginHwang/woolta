import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { toastAtom } from '../../../store/layout';

/**
 * 공통 - 토스트 메세지
 * @component
 */
export const Toast = () => {
  const toast = useAtomValue(toastAtom);

  const isHide = toast === '';
  if (isHide) {
    return null;
  }

  return (
    <S.Toast>
      <div>
        <p>{toast}</p>
      </div>
    </S.Toast>
  );
};

const S = {
  Toast: styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;

    > div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        background-color: #666666;
        padding: 1rem 1.8rem;
        color: ${({ theme }) => theme.colors.white};
        font-size: 1.4rem;
        border-radius: 6.5rem;
      }
    }
  `,
};
