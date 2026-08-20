'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getApiClient, APIResponse } from '../../_shared/api';
import { getBlogConfig } from '../../_shared/config';
import { getPostQueryKey } from '../../_shared/query-keys';
import { useBlogRoutes } from '../../_shared/routes';
import useToast from '../../_shared/toast/useToast';

type UpsertPost = { id: number; title: string; contents: string; categoryNo: number; isUpdate: boolean };

export const upsertPostApi = async (upsertPostInfo: UpsertPost) => {
  const { isUpdate, ...postInfo } = upsertPostInfo;
  const res = await getApiClient().post<APIResponse<{ categoryNo: number; postNo: number }>>('/post', postInfo);
  const upsertPost = res.data.data;

  return {
    upsertPost,
    isUpdate,
  };
};

export const useUpsertPost = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { basePath } = useBlogRoutes();

  const upsertPostMutate = useMutation({
    mutationFn: upsertPostApi,
    onSuccess: ({ upsertPost, isUpdate }) => {
      const { categoryNo, postNo } = upsertPost;
      const { tempPostAutoSaveKey } = getBlogConfig();
      localStorage.removeItem(tempPostAutoSaveKey);

      if (isUpdate) {
        queryClient.invalidateQueries({ queryKey: getPostQueryKey(String(categoryNo), String(postNo)) });
      }

      showToast(`글 ${isUpdate ? '수정' : '작성'}이 완료되었습니다.`);
      router.push(`${basePath}/categories/${categoryNo}/posts/${postNo}`);
    },
    onError: (error) => {
      showToast(error.message);
    },
  });

  const upsertPost = (post: UpsertPost) => {
    if (!validateUpsertPost(post)) {
      return;
    }
    upsertPostMutate.mutate(post);
  };

  return {
    upsertPost,
    upsertPostMutate,
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