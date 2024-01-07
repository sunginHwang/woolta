import { ComponentType, Suspense, SuspenseProps } from 'react';

export function withSuspense<P extends string | number | object>(
  WrappedComponent: ComponentType<P>,
  fallback: SuspenseProps['fallback'] = null,
) {
  function ComponentWithSuspense(props: P) {
    return (
      <Suspense fallback={fallback}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <WrappedComponent {...props} />
      </Suspense>
    );
  }

  return ComponentWithSuspense;
}
