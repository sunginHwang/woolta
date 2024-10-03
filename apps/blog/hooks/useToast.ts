import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { toastMessageAtom } from '../components/layout/store';

export default function useToast() {
  const setToast = useSetAtom(toastMessageAtom);
  const showToast = useCallback((message: string) => setToast(message), [setToast]);

  const hideToast = useCallback(() => setToast(''), [setToast]);

  const notifyToast = useCallback(
    (message: string) => {
      showToast(message);
      setTimeout(() => hideToast(), 2_000);
    },
    [showToast, hideToast],
  );

  return { showToast, hideToast, notifyToast };
}
