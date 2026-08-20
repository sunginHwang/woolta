'use client';

import { useEffect, MouseEvent, useState } from 'react';

const BILLION = 1_000_000_000;

interface UseNumberAmountProps {
  maxAmount?: number;
  currentAmount: number;
  subFix?: string;
  onAmountChange?: (amount: number) => void;
}

export function useNumberAmount({
  maxAmount = BILLION,
  onAmountChange,
  currentAmount,
  subFix = '원',
}: UseNumberAmountProps) {
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [amount, setAmount] = useState(currentAmount);
  const [digitList, setDigitList] = useState<number[]>(
    currentAmount === 0 ? [] : String(currentAmount).split('').map(getRandomDigit),
  );

  const handleAmountChange = (amount: number) => {
    onAmountChange?.(amount);
    setAmount(amount);
  };

  const changeNumber = (num: number) => {
    const isOverMaxAmount = num > maxAmount;
    setIsValidAmount(!isOverMaxAmount);
    !isOverMaxAmount && handleAmountChange(num);
  };

  const initAmount = () => {
    handleAmountChange(0);
    setIsValidAmount(true);
    setDigitList([]);
  };

  const addAmount = (e: MouseEvent<HTMLTableDataCellElement>) => {
    const addedNumber = Number(amount + String(e.currentTarget.innerText));
    changeNumber(addedNumber);
    setDigitList((prev) => [...prev, getRandomDigit()]);
  };

  const backAmount = () => {
    const stringNumber = String(amount);
    handleAmountChange(Number(stringNumber.substring(0, stringNumber.length - 1)));
    setDigitList((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    setAmount(currentAmount);
  }, [currentAmount]);

  const displayAmount = `${amount.toLocaleString('ko-KR')}${subFix}`;

  return {
    initAmount,
    addAmount,
    backAmount,
    amount,
    displayAmount,
    isValidAmount,
    digitList,
  };
}

function getRandomDigit() {
  return new Date().valueOf() + Math.random();
}