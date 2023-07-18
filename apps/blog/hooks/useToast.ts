import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { closeToast, openToast } from '../../store/reducers/layoutReducer';

export default function useToast() {
  const dispatch = useDispatch();

  const showToast = useCallback((message: string) => {
    dispatch(openToast(message));
  }, [dispatch]);

  const hideToast = useCallback(() => {
    dispatch(closeToast());
  }, [dispatch]);

  const notifyToast = useCallback((message: string) => {
    showToast(message);
    setTimeout(() => hideToast(), 2000);
  }, [dispatch]);


  return [showToast, hideToast, notifyToast] as [typeof showToast, typeof hideToast, typeof notifyToast];
}
