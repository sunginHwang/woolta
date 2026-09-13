'use client';

import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { type ReactNode, Suspense } from 'react';
import { SaveForm } from './SaveForm';
import { type BucketForm, bucketFormAtom, bucketFormStepAtom } from './store';

/**
 * 저장 폼은 자기 jotai 스토어를 갖는다 — 화면을 벗어나면 작성 중이던 값이 남지 않는다.
 *
 * `'use client'` 가 필요하다. 이게 없으면 서버 트리에서 useHydrateAtoms 를 부르게 돼
 * "Attempted to call useHydrateAtoms() from the server" 로 SSR 이 실패하고
 * 클라이언트 렌더로 폴백했다.
 */
const INIT_BUCKET_FORM: BucketForm = {
  title: '',
  description: '',
  completeDate: '',
  mainImgFile: null,
  todoList: [],
};

const HydrateAtoms = ({ children }: { children: ReactNode }) => {
  // Provider 가 만든 스토어에 초기값을 심는다 (렌더 중 1회)
  useHydrateAtoms([
    [bucketFormAtom, INIT_BUCKET_FORM],
    [bucketFormStepAtom, 1],
  ] as const);

  return children;
};

export const BucketSaveForm = () => {
  return (
    <Provider>
      <HydrateAtoms>
        <Suspense>
          <SaveForm />
        </Suspense>
      </HydrateAtoms>
    </Provider>
  );
};
