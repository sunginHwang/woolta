import { useRef, useEffect } from 'react';

/**
 * 이전 값을 추적하는 커스텀 훅
 * @param value 현재 값
 * @returns 이전 값
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 *
 * console.log('현재 값:', count); // 1
 * console.log('이전 값:', previousCount); // 0
 * ```
 */
export function usePreviousValue<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
