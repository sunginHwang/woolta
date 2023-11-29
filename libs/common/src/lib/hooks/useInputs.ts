import { ChangeEvent, useCallback, useState } from 'react';

export function useInputs<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
    [initialValues],
  );

  return [values, onChange] as [T, typeof onChange];
}