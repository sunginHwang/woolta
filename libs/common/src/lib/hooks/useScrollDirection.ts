'use client';

import { useState } from 'react';
import { optimizeRaf } from '../utils/optimizeRaf';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type ScrollDirectionType = 'down' | 'up' | 'dafault';

/**
 * @hook 스크롤의 방향을 알기 쉽도록 도와주는 역활
 * @example
 * const scroll_direction = useScrollDirection();
 * if (scroll_direction === 'up') {...}
 * @returns 'up | 'down' | 'dafault'
 */
export const useScrollDirection = () => {
  const [scroll_direction, setScrollDirection] = useState<ScrollDirectionType>('dafault');

  useIsomorphicLayoutEffect(() => {
    let lastScrollY = window.scrollY;

    const listener = optimizeRaf(() => {
      const scrollY = window.scrollY;
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
    });

    window.addEventListener('scroll', listener, { passive: true });

    return () => window.removeEventListener('scroll', listener);
  }, []);

  return scroll_direction;
};
