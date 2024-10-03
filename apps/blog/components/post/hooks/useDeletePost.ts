'use client';

import { QueryClient, useMutation } from '@tanstack/react-query';
import useToast from 'apps/blog/hooks/useToast';
import apiCall from 'apps/blog/utils/api';
import { useRouter } from 'next/navigation';
import { POSTS_QUERY_KEY } from '../../home/hooks/usePostList';

interface DeletePostInfo {
  categoryNo: number;
  postNo: number;
}

export const deletePostApi = ({ categoryNo, postNo }: DeletePostInfo) => {
  return apiCall.delete('/post', { data: { categoryNo, postNo } });
};

export const useDeletePost = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = new QueryClient();

  const deletePostMutate = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      showToast('요청하신 게시글을 삭제하였습니다.');
      router.replace('/');
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
