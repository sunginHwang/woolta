'use client';
import { delay } from '@common';
import { useSuspenseQuery } from '@tanstack/react-query';

function useWaitQuery(props: { wait: number }) {
  const query = useSuspenseQuery({
    queryKey: ['wait'],
    queryFn: async () => {
      await delay(3000);
      console.log('run');
      return 'done';
    },
  });

  return [query.data as string, query] as const;
}

export function TestComp() {
  const [data] = useWaitQuery({ wait: 3_00000 });

  return <div>result: {data}</div>;
}
