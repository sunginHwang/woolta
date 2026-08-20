'use client';

import { useRef } from 'react';

export const useStickeyScrollReset = () => {
  const scroll_target_ref = useRef<HTMLDivElement>(null);

  const resetScrollTo = (stickey_height: number) => {
    if (!scroll_target_ref.current?.offsetTop) {
      return;
    }

    const scroll_y = window.pageYOffset;
    const target_y = scroll_target_ref.current.offsetTop - stickey_height;
    if (scroll_y < target_y) {
      return;
    }
    window.scrollTo({ top: target_y });
  };

  return {
    scroll_target_ref,
    resetScrollTo,
  };
};
