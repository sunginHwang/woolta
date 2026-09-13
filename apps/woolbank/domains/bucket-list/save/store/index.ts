import { atom } from 'jotai';

export interface Todo {
  // 서버 id 는 GraphQL ID(문자열). 저장 전 초안도 같은 타입을 쓴다.
  id: string;
  title: string;
  isComplete: boolean;
}

export interface BucketForm {
  id?: string;
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
