import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { CompleteDateForm } from './CompleteDateForm';
import { ImageForm } from './ImageForm';
import { InfoForm } from './InfoForm';
import { bucketFormAtom } from './store';
import { TodoListForm } from './TodoListForm';

export const BucketSaveForm = () => {
  return (
    <Provider>
      <HydrateAtoms initialValues={[[bucketFormAtom, initBucketForm]]}>
        <InfoForm step={1} />
        <CompleteDateForm step={2} />
        <ImageForm step={3} />
        <TodoListForm step={4} />
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
