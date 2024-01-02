import { useIsMounted } from '@common';
import { ComponentProps, FC, Suspense as ReactSuspense } from 'react';

/**
 * SSR Suspense
 */
const Suspense: FC<ComponentProps<typeof ReactSuspense>> = ({ fallback, children }) => {
  const is_mounted = useIsMounted();

  if (is_mounted) {
    return <ReactSuspense fallback={fallback}>{children}</ReactSuspense>;
  }

  return fallback;
};

export default Suspense;
