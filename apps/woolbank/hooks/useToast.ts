import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { toastAtom } from '../store/layout';

export const useToast = () => {
  const setToast = useSetAtom(toastAtom);

  const onToast = useCallback(
    (message: string) => {
      setToast(message);

      const hideAfter1Sec = setTimeout(() => {
        setToast('');
        clearTimeout(hideAfter1Sec);
      }, 2_000);
    },
    [setToast],
  );

  return {
    onToast,
  };
};
