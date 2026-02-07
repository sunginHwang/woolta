import { useMount } from '@common';
import { useState } from 'react';

export const useIosStandAlone = () => {
  const [isIosStandAlone, setIsIosStandAlone] = useState(false);

  useMount(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandAlone =
      window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    setIsIosStandAlone(isIOS && isStandAlone);
  });

  return isIosStandAlone;
};
