import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { useCallback } from 'react';
import { IconCloseCircle } from '../../atom/Icon';
import { DefaultBottomSheet } from '../DefaultBottomSheet';
import AmountForm from './AmountForm';
import { AmountDisplayText } from './AnimateAmountTest';
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
export const AmountSheet = ({ title, visible, currentAmount, onChange, oncloseModal, onComplete }: Props) => {
  const { amount, addAmount, backAmount, initAmount } = useNumberAmount({
    currentAmount,
    onAmountChange: onChange,
  });

  const handleCompleteClick = useCallback(() => {
    onComplete(amount);
  }, [amount, onComplete]);

  return (
    <DefaultBottomSheet title={title} visible={visible} oncloseModal={oncloseModal}>
      <div {...stylex.props(styles.amountDisplay)}>
        <Text variant='title1Medium' color='black' as='p'>
          <AmountDisplayText amount={amount} placeholder='0원' />
        </Text>
        <i onClick={initAmount}>
          <IconCloseCircle width={20} height={20} fill='#F0F0F0' />
        </i>
      </div>
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

const styles = stylex.create({
  amountDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: '2rem',
    marginInline: '5rem',
    paddingTop: '3rem',
  },
});
