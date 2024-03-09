import { MutableRefObject, RefCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeRefs<T = any>(refs: any[]): RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
}
