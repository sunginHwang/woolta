'use client';

import { useEffect } from 'react';
import { record } from 'rrweb';

export const RrwebTest = () => {

  useEffect(() => {
    const recorder = record({
      emit(event: any) {
        console.log(event);
      },
    });
  }, []);
  return <div>RrwebTest</div>;
};
