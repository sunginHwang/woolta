'use client';

import { useState } from 'react';

export const useToggle = (value: boolean = false) => {
  const [toggleValue, setToggleValue] = useState<boolean>(value);

  // onClick={toggle} 처럼 이벤트 핸들러로 바로 넘기면 이벤트 객체가 들어온다.
  // boolean 만 명시 값으로 보고, 그 외는 토글로 취급해 열림 상태가 고정되는 사고를 막는다.
  const toggle = (value?: boolean) => {
    if (typeof value === 'boolean') {
      setToggleValue(value);
    } else {
      setToggleValue((prev) => !prev);
    }
  };

  return [toggleValue, toggle] as const;
};
