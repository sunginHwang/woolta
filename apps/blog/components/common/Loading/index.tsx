import styled from '@emotion/styled';
import { gray400, green200 } from '@wds';
import { FC } from 'react';
import { HashLoader } from 'react-spinners';

interface Props {
  isLoading: boolean;
}

const Loading: FC<Props> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <SC.Contaienr>
      <div>
        <HashLoader color={green200} loading />
      </div>
    </SC.Contaienr>
  );
};

export default Loading;

const SC = {
  Contaienr: styled.div`
    background-color: ${gray400};
    z-index: 1000;
    position: fixed;
    top: 0 !important;
    left: 0 !important;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    background-color: rgba(0, 0, 0, 0.2);

    div {
      z-index: 1001;

      position: fixed;
      left: 50%;
      top: 50%;

      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
  `,
};
