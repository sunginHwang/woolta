import { atom } from 'jotai';

export interface Todo {
  id: number;
  title: string;
  isComplete: boolean;
}

export interface BucketForm {
  id?: number;
  title: string;
  description: string;
  completeDate: string;
  todoList: Todo[];
  mainImgFile: File | null;
  imageUrl?: string;
  thumbImageUrl?: string;
}

export const bucketFormStepAtom = atom(1);

export const bucketFormAtom = atom<BucketForm>({
  title: '',
  description: '',
  completeDate: '',
  mainImgFile: null,
  todoList: [],
});

export const setBucketDefaultInfoAtom = atom(null, (get, set, update: Pick<BucketForm, 'title' | 'description'>) => {
  set(bucketFormAtom, (bucket) => ({
    ...bucket,
    title: update.title,
    description: update.description,
  }));
});

export const setBucketCompleteDateAtom = atom(null, (get, set, update: Pick<BucketForm, 'completeDate'>) => {
  set(bucketFormAtom, (bucket) => ({
    ...bucket,
    completeDate: update.completeDate,
  }));
});

export const setBucketImgAtom = atom(null, (get, set, update: Pick<BucketForm, 'mainImgFile'>) => {
  set(bucketFormAtom, (bucket) => ({
    ...bucket,
    mainImgFile: update.mainImgFile,
  }));
});

export const setBucketTodoListAtom = atom(null, (get, set, todoList: Todo[]) => {
  set(bucketFormAtom, (bucket) => ({
    ...bucket,
    todoList,
  }));
});
