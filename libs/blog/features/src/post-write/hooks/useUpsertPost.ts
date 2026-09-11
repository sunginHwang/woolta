'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCreatePostMutation, useUpdatePostMutation } from '../../_shared/api/gql.generated';
import { getBlogConfig } from '../../_shared/config';
import { getPostQueryKey } from '../../_shared/query-keys';
import { useBlogRoutes } from '../../_shared/routes';
import useToast from '../../_shared/toast/useToast';

type UpsertPost = { id: number; title: string; contents: string; categoryNo: number; isUpdate: boolean };

export const useUpsertPost = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { basePath } = useBlogRoutes();

  /**
   * 레거시는 POST /post 하나가 생성·수정을 겸했지만 서버 뮤테이션은 둘로 나뉘어 있다.
   * 어느 쪽이든 { categoryNo, postNo } 를 돌려주므로 후처리는 공통이다.
   */
  const onUpsertSuccess = (categoryNo: number, postNo: number, isUpdate: boolean) => {
    const { tempPostAutoSaveKey } = getBlogConfig();
    localStorage.removeItem(tempPostAutoSaveKey);

    if (isUpdate) {
      queryClient.invalidateQueries({ queryKey: getPostQueryKey(String(categoryNo), String(postNo)) });
    }

    showToast(`글 ${isUpdate ? '수정' : '작성'}이 완료되었습니다.`);
    router.push(`${basePath}/categories/${categoryNo}/posts/${postNo}`);
  };

  const onUpsertError = (error: Error) => showToast(error.message);

  const createPostMutate = useCreatePostMutation({
    onSuccess: ({ createPost }) => onUpsertSuccess(createPost.categoryNo, createPost.postNo, false),
    onError: onUpsertError,
  });

  const updatePostMutate = useUpdatePostMutation({
    onSuccess: ({ updatePost }) => onUpsertSuccess(updatePost.categoryNo, updatePost.postNo, true),
    onError: onUpsertError,
  });

  const upsertPost = (post: UpsertPost) => {
    if (!validateUpsertPost(post)) {
      return;
    }

    const { id, title, contents, categoryNo, isUpdate } = post;

    if (isUpdate) {
      updatePostMutate.mutate({ input: { id, title, contents, categoryNo } });
      return;
    }

    createPostMutate.mutate({ input: { title, contents, categoryNo } });
  };

  return {
    upsertPost,
    isUpserting: createPostMutate.isPending || updatePostMutate.isPending,
  };
};

function validateUpsertPost(post: UpsertPost) {
  const { title, contents, categoryNo } = post;

  if (title.length < 1 || title.length > 100) {
    alert('제목은 1~100글자 사이로 입력하세요.');
    return false;
  }

  if (contents === '') {
    alert('게시글 내용을 작성해 주세요.');
    return false;
  }

  if (contents.length < 5) {
    alert('게시글 내용이 너무 적습니다.');
    return false;
  }

  if (categoryNo === null) {
    alert('카테고리를 선택해주세요.');
    return false;
  }

  if (categoryNo < 0) {
    alert('카테고리 선택이 잘못되었습니다. 다시 선택해주세요.');
    return false;
  }

  return true;
}
