import { useEffect } from 'react';

export function useEventListener(eventType: string, callback: EventListenerOrEventListenerObject) {
  useEffect(() => {
    window.addEventListener(eventType, callback, { passive: false });
    return () => {
      window.removeEventListener(eventType, callback);
    };
  }, [eventType, callback]);

  return null;
}
