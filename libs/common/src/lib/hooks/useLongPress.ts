import { useRef } from 'react';
import { useMount } from './useMount';

interface LongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  ms?: number;
}

const defaultOptions = {
  ms: 1_000, // 1초
};

export const useLongPress = ({ onLongPress, onClick, ms }: LongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useMount(() => {
    return () => {
      clearTimer();
    };
  });

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      onLongPress();
    }, ms || defaultOptions.ms);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      if (onClick) {
        onClick();
      }
    }
  };

  const handleMouseDown = () => {
    startTimer();
  };

  const handleMouseUp = () => {
    clearTimer();
  };

  return { onMouseDown: handleMouseDown, onMouseUp: handleMouseUp };
};
