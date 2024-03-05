'use client';

import { useCallback, useState, ChangeEvent } from 'react';

export function useInputs<T extends object>(defaultValues: T) {
  type NameType = keyof T;

  const [inputs, setInputs] = useState(defaultValues);

  const setInput = useCallback(
    <T>(name: NameType, value: T) => {
      setInputs((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },
    [setInputs],
  );

  // 인풋 이벤트 변경
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInput(name as NameType, value);
    },
    [setInput],
  );

  const onClear = useCallback(
    (type: NameType) => {
      setInput(type, defaultValues[type]);
    },
    [defaultValues, setInput],
  );

  const onReset = useCallback(() => {
    setInputs(Object.assign({}, defaultValues));
  }, [setInputs, defaultValues]);

  return {
    inputs,
    onChange,
    onClear,
    onReset,
    setInput,
    setInputs,
  };
}
