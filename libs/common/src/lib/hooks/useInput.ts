'use client';

import { ChangeEvent, useCallback, useState } from 'react';

export function useInput(initialValues: string) {
  const [value, setValue] = useState(initialValues);
  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const onReset = useCallback(() => setValue(''), []);

  return [value, onChange, onReset] as [string, typeof onChange, typeof onReset];
}
