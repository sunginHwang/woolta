'use client';

import { useState } from 'react';

export const useToggle = (value: boolean = false) => {
  const [toggleValue, setToggleValue] = useState<boolean>(value);

  const toggle = (value?: boolean) => {
    if (value === undefined) {
      setToggleValue((prev) => !prev);
    } else {
      setToggleValue(value);
    }
  };

  return [toggleValue, toggle] as const;
};
