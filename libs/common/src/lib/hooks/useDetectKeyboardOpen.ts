import {  useState } from 'react';
import { useMount } from './useMount';

export const useDetectKeyboardOpen = (minKeyboardHeight: number = 300, defaultValue: boolean = false) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(defaultValue);

  useMount(() => {
    const listener = () => {
      if (typeof window.visualViewport !== 'undefined' && window.visualViewport) {
        const newState = window.screen.height - minKeyboardHeight > window.visualViewport.height
        if (isKeyboardOpen !== newState) {
          setIsKeyboardOpen(newState);
        }
      }
    };

    if (typeof window.visualViewport !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', listener);
    }

    return () => {
      if (typeof window.visualViewport !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', listener);
      }
    };
  });

  return isKeyboardOpen;
};

