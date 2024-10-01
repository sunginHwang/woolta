import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { Suspense } from 'react';
import { SaveForm } from './SaveForm';
import { bucketFormAtom, bucketFormStepAtom } from './store';

export const BucketSaveForm = () => {
  return (
    <Provider>
      <HydrateAtoms
        initialValues={[
          [bucketFormAtom, initBucketForm],
          [bucketFormStepAtom, 1],
        ]}
      >
        <Suspense>
          <SaveForm />
        </Suspense>
      </HydrateAtoms>
    </Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HydrateAtoms = ({ initialValues, children }: any) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues);
  return children;
};

const initBucketForm = {
  title: '',
  description: '',
  completeDate: '',
  mainImgFile: null,
  todoList: [],
};
