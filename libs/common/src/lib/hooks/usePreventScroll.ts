import { useLayoutEffect, useRef } from 'react';
import { useMount } from './useMount';

export const usePreventScroll = (condition: boolean) => {
  const positionY = useRef(0);

  useLayoutEffect(() => {
    const scrollPosition = window.pageYOffset;
    if (condition) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
      positionY.current = scrollPosition;
    } else {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      window.scrollTo(0, positionY.current);
    }
  }, [condition]);

  useMount(() => {
    return () => {
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      window.scrollTo(0, positionY.current);
    };
  });
};
