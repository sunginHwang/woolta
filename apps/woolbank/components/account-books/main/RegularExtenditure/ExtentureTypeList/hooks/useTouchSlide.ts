import { useState } from 'react';

export const useTouchSlide = () => {
  const [startX, setStartX] = useState(0);
  const [moveX, setMoveX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLLIElement>) => {
    setStartX(e.targetTouches[0].screenX || 0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLLIElement>) => {
    const nextX = e.targetTouches[0].screenX || 0;
    const calc = startX - nextX;
    setMoveX(calc < 0 ? 0 : calc > 200 ? 200 : calc);
  };

  const handleTouchEnd = () => {
    if (moveX > 50 && moveX <= 200) {
      setMoveX(200);
      return;
    }
    setMoveX(0);
  };

  return {
    moveX,
    setMoveX,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } as const;
};
