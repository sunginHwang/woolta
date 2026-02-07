import { usePreviousValue } from '@common';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, memo, useMemo } from 'react';
import { styled } from 'styled-components';

// 애니메이션 상수 (컴포넌트 외부에 정의하여 객체 참조 안정화)
const ANIMATION_INITIAL_WITH_MOTION = { y: -30, opacity: 0 } as const;
const ANIMATION_INITIAL_NO_MOTION = { y: 0, opacity: 1 } as const;
const ANIMATION_ANIMATE = { y: 0, opacity: 1 } as const;
const ANIMATION_EXIT = { y: -30, x: -10, opacity: 0, width: 0 } as const;

const DOT_ANIMATION = {
  initial: { width: 0, x: -3 },
  animate: { width: 'auto', x: 0 },
} as const;

const TRANSITION_CONFIG = {
  duration: 0.15,
  ease: 'linear',
} as const;

const INLINE_BLOCK_STYLE = { display: 'inline-block' } as const;

interface Props {
  amount: number;
  placeholder?: string;
}

export const AmountDisplayText = memo(({ amount, placeholder }: Props) => {
  const previousAmount = usePreviousValue(amount);

  const amountDigitList = useMemo(() => String(amount).split(''), [amount]);
  const previousAmountDigitList = useMemo(() => String(previousAmount).split(''), [previousAmount]);

  if (amount === 0) {
    return <SC.PlaceHolder>{placeholder}</SC.PlaceHolder>;
  }

  return (
    <>
      <AnimatePresence>
        {amountDigitList.map((digit, index) => {
          // 현재 인덱스까지의 쉼표 개수 계산
          const commaCount = amountDigitList.slice(0, index + 1).filter((char) => char === ',').length;

          // 현재 숫자에 ,를 붙여야 하는지 판단
          const realIndex = index - commaCount;
          const totalDigits = amountDigitList.filter((char) => char !== ',').length;
          const shouldHaveComma = (totalDigits - realIndex - 1) % 3 === 0 && realIndex < totalDigits - 1;
          // 이전값과 비교해서 매칭되는 경우는 애니메이션을 사용 안합니다.
          // 처리 필요이유는 숫자가 변경되면 rerender가 발생하여 모든 애니메이션이 재동작 하기 때문
          // ex.) 123 -> 12 이렇게 3을 제거하는 경우 12에 대한 모든 리랜더가 일어나기때문
          const hasAlreadyAnimated = digit === previousAmountDigitList[index];
          const useAnimation = !hasAlreadyAnimated;

          return (
            <Fragment key={`animated-${index}`}>
              <AnimatedNumber digit={digit} use_animation={useAnimation} index={index} />
              {shouldHaveComma && <AnimatedComma index={index} />}
            </Fragment>
          );
        })}
      </AnimatePresence>
      원
    </>
  );
});

// 숫자 애니메이션 컴포넌트
const AnimatedNumber = memo(({ digit, index, use_animation }: { digit: string; index: number; use_animation?: boolean }) => {
  const normalAnimation = useMemo(
    () => ({
      initial: use_animation ? ANIMATION_INITIAL_WITH_MOTION : ANIMATION_INITIAL_NO_MOTION,
      animate: ANIMATION_ANIMATE,
      exit: ANIMATION_EXIT,
    }),
    [use_animation],
  );

  return (
    <motion.span
      key={`${digit}-${index}`}
      {...normalAnimation}
      transition={TRANSITION_CONFIG}
      style={INLINE_BLOCK_STYLE}
    >
      {digit}
    </motion.span>
  );
});

// 쉼표 애니메이션 컴포넌트
const AnimatedComma = memo(({ index }: { index: number }) => {
  return (
    <motion.span
      key={`comma-${index}`}
      {...DOT_ANIMATION}
      transition={TRANSITION_CONFIG}
      style={INLINE_BLOCK_STYLE}
    >
      ,
    </motion.span>
  );
});

const SC = {
  PlaceHolder: styled.span`
    opacity: 0.2;
  `,
};
