'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getApiClient } from '../../_shared/api';
import { POSTS_QUERY_KEY } from '../../_shared/query-keys';
import { useBlogRoutes } from '../../_shared/routes';
import useToast from '../../_shared/toast/useToast';

interface DeletePostInfo {
  categoryNo: number;
  postNo: number;
}

export const deletePostApi = ({ categoryNo, postNo }: DeletePostInfo) => {
  return getApiClient().delete('/post', { data: { categoryNo, postNo } });
};

export const useDeletePost = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { basePath } = useBlogRoutes();

  const deletePostMutate = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      showToast('요청하신 게시글을 삭제하였습니다.');
      router.replace(basePath);
    },
    onError: () => {
      showToast('게시글 삭제에 실패하였습니다.');
    },
  });

  const deletePost = (deleteInfo: DeletePostInfo) => {
    deletePostMutate.mutate(deleteInfo);
  };

  return {
    deletePost,
    deletePostMutate,
  };
};
