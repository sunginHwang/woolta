'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useCallback } from 'react';
import { IconCloseCircle } from '../../icons';
import { DefaultBottomSheet } from '../DefaultBottomSheet';
import AmountForm from './AmountForm';
import { AmountDisplayText } from './AnimateAmountTest';
import { useNumberAmount } from './useNumberAmount';

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
        <Text variant='title1Medium' color='textPrimary' as='p'>
          <AmountDisplayText amount={amount} placeholder='0원' />
        </Text>
        <i onClick={initAmount}>
          <IconCloseCircle width={20} height={20} fill={colorVars['--color-gray150']} />
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
    marginInline: '5rem',
    marginBottom: '2rem',
    paddingTop: '3rem',
  },
});
