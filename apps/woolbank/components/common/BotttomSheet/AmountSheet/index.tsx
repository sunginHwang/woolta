import { Text } from '@wds';
import { motion, AnimatePresence } from 'framer-motion';
import { FC, useCallback, useRef, useEffect, useState } from 'react';
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
  const { displayAmount, amount, addAmount, backAmount, initAmount } = useNumberAmount({
    currentAmount,
    onAmountChange: onChange,
  });
  const {
    colors: { gray150 },
  } = useTheme();

  const prevAmountRef = useRef(amount);
  const [animatedDigits, setAnimatedDigits] = useState<string[]>([]);

  // 금액이 변경될 때 애니메이션할 숫자들을 계산
  useEffect(() => {
    const prevAmount = prevAmountRef.current;
    const currentAmountStr = amount.toString();
    const prevAmountStr = prevAmount.toString();

    // 새로 추가된 숫자들을 찾기
    if (currentAmountStr.length > prevAmountStr.length) {
      const newDigits = currentAmountStr.slice(prevAmountStr.length);
      setAnimatedDigits(newDigits.split(''));
    } else {
      setAnimatedDigits([]);
    }

    prevAmountRef.current = amount;
  }, [amount]);

  const handleCompleteClick = useCallback(() => {
    onComplete(amount);
  }, [amount, onComplete]);

  // 숫자 애니메이션 컴포넌트
  const AnimatedNumber = ({ digit, index }: { digit: string; index: number }) => (
    <motion.span
      key={`${digit}-${index}`}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{
        duration: 0.2,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      style={{ display: 'inline-block' }}
    >
      {digit}
    </motion.span>
  );

  // 금액 표시를 위한 컴포넌트
  const renderAmountDisplay = () => {
    const amountStr = amount.toString();
    const prevAmountStr = prevAmountRef.current.toString();

    // 이전 금액과 현재 금액이 같으면 일반 텍스트로 표시
    // if (amountStr === prevAmountStr) {
    //   return displayAmount;
    // }

    // 새로 추가된 숫자들이 있으면 애니메이션 적용
    if (animatedDigits.length > 0) {
      const baseAmount = amountStr.slice(0, -animatedDigits.length);
      const formattedBaseAmount = Number(baseAmount).toLocaleString('ko-KR');

      return (
        <>
          {formattedBaseAmount}
          <AnimatePresence>
            {animatedDigits.map((digit, index) => (
              <AnimatedNumber key={`animated-${index}`} digit={digit} index={index} />
            ))}
          </AnimatePresence>
          원
        </>
      );
    }

    return displayAmount;
  };

  return (
    <DefaultBottomSheet title={title} visible={visible} oncloseModal={oncloseModal}>
      <SC.AmountDisplay>
        <Text variant='title1Medium' color='black' as='p'>
          {renderAmountDisplay()}
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
