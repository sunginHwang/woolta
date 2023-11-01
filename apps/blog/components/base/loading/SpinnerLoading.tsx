import { HashLoader } from 'react-spinners';
import { gray400 } from 'apps/blog/style/colors';
import styled from '@emotion/styled';

type SpinnerLoadingProps = {
  loading: boolean;
};

function SpinnerLoading({ loading }: SpinnerLoadingProps) {
  return (
    <>
      {loading && (
        <SC.Contaienr>
          <div>
            <HashLoader color={'#6e827f'} loading={loading} />
          </div>
        </SC.Contaienr>
      )}
    </>
  );
}

export default SpinnerLoading;

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
