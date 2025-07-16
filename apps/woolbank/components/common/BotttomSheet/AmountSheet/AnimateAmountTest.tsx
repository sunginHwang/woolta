import { usePreviousValue } from '@common';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  amount: number;
  placeholder?: string;
}
export const AmountDisplayText = memo(({ amount, placeholder }: Props) => {
  const previousAmount = usePreviousValue(amount);
  const [digitList, setDigitList] = useState<string[]>(
    amount === 0 ? [] : String(amount).split('').map(getRandomDigit),
  );

  useEffect(() => {
    setDigitList(String(amount).split('').map(getRandomDigit));
  }, [amount]);

  const amountDigitList = useMemo(() => String(amount).split(''), [amount]);
  const previousAmountDigitList = String(previousAmount).split('');
  if (amount === 0) {
    return <SC.PlaceHolder>{placeholder}</SC.PlaceHolder>;
  }

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
            `index: ${index}, digit: ${digit}, commaCount: ${commaCount}, realIndex: ${realIndex}, shouldHaveComma: ${shouldHaveComma}, dightKey:${
              digitList[realIndex]
            }, use_animation:${digitList[realIndex] ? true : false}`,
          );

          const useAnimation = digit === previousAmountDigitList[index];
          return (
            <Fragment key={`animated-${index}`}>
              <AnimatedNumber digit={digit} use_animation={!useAnimation} index={index} />
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
        duration: 0.15,
        ease: 'linear',
      }}
      style={{ display: 'inline-block' }}
    >
      {digit}
    </motion.span>
  );
};

const SC = {
  PlaceHolder: styled.span`
    opacity: 0.2;
  `,
};

function getRandomDigit(num: string, index: number) {
  return `${num}-${index}`;
}
