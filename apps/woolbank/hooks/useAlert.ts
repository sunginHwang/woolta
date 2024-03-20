import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { alertAtom } from '../store/layout';

export const useAlert = () => {
  const setAlert = useSetAtom(alertAtom);

  const onAlert = useCallback(
    (message: string) => {
      setAlert(message);
    },
    [setAlert],
  );

  const offAlert = useCallback(() => {
    setAlert('');
  }, [setAlert]);

  return {
    onAlert,
    offAlert,
  };
};
