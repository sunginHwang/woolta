import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { toastMessageAtom } from '../components/layout/store';

export default function useToast() {
  const setToast = useSetAtom(toastMessageAtom);
  const showToast = (message: string) => setToast(message);

  const hideToast = () => setToast('');

  const notifyToast = useCallback((message: string) => {
    showToast(message);
    setTimeout(() => hideToast(), 2_000);
  }, []);

  return { showToast, hideToast, notifyToast };
}
