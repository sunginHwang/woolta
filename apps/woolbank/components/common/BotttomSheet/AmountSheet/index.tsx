import { usePreviousValue } from '@common';
import { Text } from '@wds';
import { motion, AnimatePresence } from 'framer-motion';
import { FC, useCallback, useRef, useEffect, useState, memo, Fragment } from 'react';
import { styled, useTheme } from 'styled-components';
import { IconCloseCircle } from '../../../atom/Icon';
import DefaultBottomSheet from '../DefaultBottomSheet';
import AmountForm from './AmountForm';
import { AmountDisplay } from './AnimateAmount';
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
const AmountSheet = ({ title, visible, currentAmount, onChange, oncloseModal, onComplete }: Props) => {
  const { digitList, amount, addAmount, backAmount, initAmount } = useNumberAmount({
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
          <AmountDisplayText amount={amount} placeholder='얼마나 썻나요?' />
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
    padding-top: 3rem;
  `,
};
