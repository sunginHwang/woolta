import { useDebounce } from '@croquiscom/monolith';
import { useEffect, MouseEvent, useState } from 'react';
const BILLION = 1_000_000_000;

interface useNumberAmountProps {
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
}: useNumberAmountProps) {
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [amount, setAmount] = useState(currentAmount);
  const [digitList, setDigitList] = useState<number[]>(
    currentAmount === 0 ? [] : String(currentAmount).split('').map(getRandomDigit),
  );

  const handleAmountchange = (amount: number) => {
    onAmountChange?.(amount);
    setAmount(amount);
  };

  // 금액 변경 이벤트
  const changeNumber = (num: number) => {
    // 최대 입금 가능 금액 체크
    const isOverMaxAmount = num > maxAmount;
    setIsValidAmount(!isOverMaxAmount);
    !isOverMaxAmount && handleAmountchange(num);
  };

  // 금액 초기화
  const initAmount = () => {
    handleAmountchange(0);
    setIsValidAmount(true);
    setDigitList([]);
  };

  // 금액 추가
  const addAmount = (e: MouseEvent<HTMLTableDataCellElement>) => {
    const addedNumber = Number(amount + String(e.currentTarget.innerText));
    changeNumber(addedNumber);
    setDigitList((prev) => [...prev, getRandomDigit()]);
  };

  // 금액 한개 빼기
  const backAmount = () => {
    const stringNumber = String(amount);
    console.log('stringNumber', stringNumber);
    console.log(Number(stringNumber.substring(0, stringNumber.length - 1)));
    handleAmountchange(Number(stringNumber.substring(0, stringNumber.length - 1)));
    setDigitList((prev) => prev.slice(0, -1));
  };

  // 금액 변경 싱크 맞추기
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
