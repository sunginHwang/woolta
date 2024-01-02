import { useState } from 'react';
import { useMount } from './useMount';

type windowDemensionType = {
  width: number;
  height: number;
};

function getWindowDimensions(): windowDemensionType {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<windowDemensionType>(getWindowDimensions());

  useMount(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return windowDimensions;
}
