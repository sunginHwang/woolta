import { useState } from 'react';
import { useMount } from './useMount';

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useMount(() => {
    setMounted(true);
  });

  return mounted;
}
