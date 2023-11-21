import { atom } from 'jotai';

export interface WritePost {
  category: string;
  content: string;
  postNo: number | null;
  title: string;
}
export const postTitleAtom = atom<string>('');
export const postContentAtom = atom<string>('');
export const postCategoryAtom = atom<string>('');
export const postNoAtom = atom<number | null>(null);

export const postAtom = atom((get) => {
  const title = get(postTitleAtom);
  const content = get(postContentAtom);
  const category = get(postCategoryAtom);
  const postNo = get(postNoAtom);

  return {
    title,
    content,
    category,
    postNo,
  };
});

export const setPostAtom = atom(null, (_, set, newPost: WritePost) => {
  const { title, content, category, postNo } = newPost;
  set(postTitleAtom, title);
  set(postContentAtom, content);
  set(postCategoryAtom, category);
  set(postNoAtom, postNo);
});
