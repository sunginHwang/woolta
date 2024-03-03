import { CompleteDateForm } from './CompleteDateForm';
import { ImageForm } from './ImageForm';
import { InfoForm } from './InfoForm';
import { TodoListForm } from './TodoListForm';

export const BucketSaveForm = () => {
  return (
    <>
      <InfoForm step={1} />
      <CompleteDateForm step={2} />
      <ImageForm step={3} />
      <TodoListForm step={4} />
    </>
  );
};
