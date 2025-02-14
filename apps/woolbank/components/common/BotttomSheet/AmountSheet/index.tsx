import { styled, useTheme } from 'styled-components';
import { Text } from '@wds';
import { FC, useCallback } from 'react';
import { IconCloseCircle } from '../../../atom/Icon';
import DefaultBottomSheet from '../DefaultBottomSheet';
import AmountForm from './AmountForm';
import { useNumberAmount } from './hooks/useNumberAmount';

interface Props {
  title: string;
  visible: boolean;
  currentAmount: number;
  oncloseModal: () => void;
  onChange?: (amount: number) => void;
  onComplete: (amount: number) => void;
}

/**
 * 금액 입력 모달
 * @component
 */
const AmountSheet: FC<Props> = ({ title, visible, currentAmount, onChange, oncloseModal, onComplete }) => {
  const { displayAmount, amount, addAmount, backAmount, initAmount } = useNumberAmount({
    currentAmount,
    onAmountChange: onChange,
  });
  const {
    colors: { gray150 },
  } = useTheme();

  const handleCompleteClick = useCallback(() => {
    onComplete(amount);
  }, [amount, onComplete]);

  return (
    <DefaultBottomSheet title={title} visible={visible} oncloseModal={oncloseModal}>
      <SC.AmountDisplay>
        <Text variant='title1Medium' color='black' as='p'>
          {displayAmount}
        </Text>
        <i onClick={initAmount}>
          <IconCloseCircle width={20} height={20} fill={gray150} />
        </i>
      </SC.AmountDisplay>
      <AmountForm
        useCompleteBtn
        isZeroAmount={amount === 0}
        onNumberClick={addAmount}
        onBackNumberClick={backAmount}
        onRightBottomClick={handleCompleteClick}
      />
    </DefaultBottomSheet>
  );
};

export default AmountSheet;

const SC = {
  AmountDisplay: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 5rem 2rem 5rem;
  `,
};
