import { typography } from '@wds';
import { MouseEvent, FC } from 'react';
import { styled } from 'styled-components';
import { vibrate } from '../../../utils/browsers/vibrate';
import { Button } from '../../atom/Button';

const VIBRATION_PATTERN = 10;
interface Props {
  visible?: boolean;
  useCompleteBtn?: boolean;
  showInitBtn?: boolean;
  isZeroAmount: boolean;
  onNumberClick: (e: MouseEvent<HTMLTableDataCellElement>) => void;
  onBackNumberClick: () => void;
  // 우측 최 하단 클릭
  onRightBottomClick: () => void;
}

const AmountForm: FC<Props> = ({
  useCompleteBtn = false,
  isZeroAmount,
  onNumberClick,
  onRightBottomClick,
  onBackNumberClick,
}) => {
  const handleNumberClick = (e: MouseEvent<HTMLTableDataCellElement>) => {
    vibrate(VIBRATION_PATTERN);
    onNumberClick(e);
  };

  const handleBackNumberClick = () => {
    vibrate(VIBRATION_PATTERN);
    onBackNumberClick();
  };

  const handleRightBottomClick = (e: MouseEvent<HTMLTableDataCellElement>) => {
    vibrate(VIBRATION_PATTERN);
    onRightBottomClick();
  };

  return (
    <SC.Input>
      <SC.InputTable>
        <tbody>
          <tr>
            <SC.InputTd data-cy='number_1' data-number={1} onClick={handleNumberClick}>
              1
            </SC.InputTd>
            <SC.InputTd data-cy='number_2' data-number={2} onClick={handleNumberClick}>
              2
            </SC.InputTd>
            <SC.InputTd data-cy='number_3' data-number={3} onClick={handleNumberClick}>
              3
            </SC.InputTd>
          </tr>
          <tr>
            <SC.InputTd data-cy='number_4' data-number={4} onClick={handleNumberClick}>
              4
            </SC.InputTd>
            <SC.InputTd data-cy='number_5' data-number={5} onClick={handleNumberClick}>
              5
            </SC.InputTd>
            <SC.InputTd data-cy='number_6' data-number={6} onClick={handleNumberClick}>
              6
            </SC.InputTd>
          </tr>
          <tr>
            <SC.InputTd data-cy='number_7' data-number={7} onClick={handleNumberClick}>
              7
            </SC.InputTd>
            <SC.InputTd data-cy='number_8' data-number={8} onClick={handleNumberClick}>
              8
            </SC.InputTd>
            <SC.InputTd data-cy='number_9' data-number={9} onClick={handleNumberClick}>
              9
            </SC.InputTd>
          </tr>
          <tr>
            <SC.InputTd data-cy='numberBack' $isHide={isZeroAmount} onClick={handleBackNumberClick}>
              {!isZeroAmount && '←'}
            </SC.InputTd>
            <SC.InputTd data-cy='number_0' data-number={0} onClick={handleNumberClick}>
              0
            </SC.InputTd>
            {useCompleteBtn && (
              <SC.InputTd
                data-cy='numberComplete'
                $isHide={isZeroAmount}
                $isSmall={true}
                onClick={handleRightBottomClick}
              >
                {!isZeroAmount && (
                  <SC.SaveButton>
                    <Button fill>확인</Button>
                  </SC.SaveButton>
                )}
              </SC.InputTd>
            )}
            {!useCompleteBtn && (
              <SC.InputTd data-cy='numberX' $isHide={isZeroAmount} onClick={handleRightBottomClick}>
                {!isZeroAmount && 'x'}
              </SC.InputTd>
            )}
          </tr>
        </tbody>
      </SC.InputTable>
    </SC.Input>
  );
};

export default AmountForm;

type InputTdProps = {
  $isHide?: boolean;
  $isSmall?: boolean;
};
const SC = {
  SaveButton: styled.div`
    padding: 0 2rem;
    margin: -4px 0;
  `,
  Input: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  `,
  InputTable: styled.table`
    width: 100%;
    text-align: center;
    flex: 1;
    color: ${({ theme }) => theme.colors.black};
    height: 83%;
  `,
  InputTd: styled.td<InputTdProps>`
    ${typography.title3Medium}
    width: 33.33333%;
    padding: ${({ $isSmall }) => ($isSmall ? '.3rem' : '1rem')} 0;

    &:active {
      border-radius: 1.6rem;
      background-color: ${({ $isHide, theme }) => ($isHide ? theme.colors.white : theme.colors.gray150)};
    }
  `,
};
