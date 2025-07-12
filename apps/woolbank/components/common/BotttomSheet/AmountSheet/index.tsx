import { usePreviousValue } from '@common';
import { Text } from '@wds';
import { motion, AnimatePresence } from 'framer-motion';
import { FC, useCallback, useRef, useEffect, useState, memo, Fragment } from 'react';
import { styled, useTheme } from 'styled-components';
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
const AmountSheet = ({ title, visible, currentAmount, onChange, oncloseModal, onComplete }: Props) => {
  const { displayAmount, digitList, amount, addAmount, backAmount, initAmount } = useNumberAmount({
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
          <AmountDisplay amount={amount} digitList={digitList} />
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

const AmountDisplay = memo(({ amount, digitList }: { amount: number; digitList: number[] }) => {
  console.log('AmountDisplay-rerender');

  const amountDigitList = String(amount).split('');
  console.log('amount', amount);

  return (
    <>
      <AnimatePresence>
        {amountDigitList.map((digit, index) => {
          // 현재 인덱스까지의 쉼표 개수 계산
          const commaCount = amountDigitList.slice(0, index + 1).filter((char) => char === ',').length;

          // 현재 숫자가 쉼표를 붙여야 하는지 판단
          const realIndex = index - commaCount;
          const totalDigits = amountDigitList.filter((char) => char !== ',').length;
          const shouldHaveComma = (totalDigits - realIndex - 1) % 3 === 0 && realIndex < totalDigits - 1;

          console.log(
            `index: ${index}, digit: ${digit}, commaCount: ${commaCount}, realIndex: ${realIndex}, shouldHaveComma: ${shouldHaveComma}, dightKey:${digitList[realIndex]}`,
          );

          return (
            <Fragment key={`animated-${index}`}>
              <AnimatedNumber digit={digit} use_animation={digitList[realIndex] ? true : false} index={index} />
              {shouldHaveComma && <AnimatedNumber digit={','} use_animation index={index} />}
            </Fragment>
          );
        })}
      </AnimatePresence>
      원
    </>
  );
});

// 숫자 애니메이션 컴포넌트
const AnimatedNumber = ({ digit, index, use_animation }: { digit: string; index: number; use_animation?: boolean }) => {
  const initial = use_animation ? { y: -30, opacity: 0 } : { y: 0, opacity: 1 };
  const HasDot = digit.includes(',');

  const dotAnimation = {
    initial: { width: 0, x: -3 },
    animate: { width: 'auto', x: 0 },
  };

  const normalAnimation = {
    initial,
    animate: { y: 0, opacity: 1 },
    exit: { y: -30, x: -10, opacity: 0, width: 0 },
  };

  const animation = HasDot ? dotAnimation : normalAnimation;

  return (
    <motion.span
      key={`${digit}-${index}`}
      {...animation}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      style={{ display: 'inline-block' }}
    >
      {digit}
    </motion.span>
  );
};

const SC = {
  AmountDisplay: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 5rem 2rem 5rem;
  `,
};
