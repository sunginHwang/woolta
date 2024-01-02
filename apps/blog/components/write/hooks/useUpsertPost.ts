import { QueryClient, useMutation } from '@tanstack/react-query';
import useToast from 'apps/blog/hooks/useToast';
import apiCall, { APIResponse } from 'apps/blog/utils/api';
import { useRouter } from 'next/navigation';
import { getPostQueryKey } from '../../post/hooks/usePost';
import config from 'apps/blog/utils/config';

type UpsertPost = { id: number; title: string; contents: string; categoryNo: number; isUpdate: boolean };

export const upsertPostApi = async (upsertPostInfo: UpsertPost) => {
  const { isUpdate, ...postInfo } = upsertPostInfo;
  const res = await apiCall.post<APIResponse<{ categoryNo: number; postNo: number }>>(`/post`, postInfo);
  const upsertPost = res.data.data;

  return {
    upsertPost,
    isUpdate,
  };
};

export const useUpsertPost = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const queryClient = new QueryClient();

  const upsertPostMutate = useMutation({
    mutationFn: upsertPostApi,
    onSuccess: ({ upsertPost, isUpdate }) => {
      const { categoryNo, postNo } = upsertPost;
      localStorage.removeItem(config.tempPostAutoSave);

      if (isUpdate) {
        queryClient.invalidateQueries({ queryKey: getPostQueryKey(categoryNo, postNo) });
      }

      showToast(`글 ${isUpdate ? '수정' : '작성'}이 완료되었습니다.`);
      router.push(`categories/${categoryNo}/posts/${postNo}`);
    },
    onError: alert,
  });

  // 글 생성 or 업데이트
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
