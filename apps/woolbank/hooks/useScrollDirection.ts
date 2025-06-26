import { useMount } from '@common';
import throttle from 'lodash-es/throttle';
import { useRef, useState } from 'react';

export type ScrollDirection = 'none' | 'up' | 'down';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none');
  const scrollPosition = useRef(0);

  useMount(() => {
    const handleScroll = throttle(() => {
      const position = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.body.scrollHeight;
      const isBottom = window.innerHeight >= scrollHeight - position;
      const isTop = position <= 0;

      if (isBottom || isTop) {
        return;
      }

      if (position > scrollPosition.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      scrollPosition.current = position;
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return scrollDirection;
};
