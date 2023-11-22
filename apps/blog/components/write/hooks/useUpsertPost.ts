import { useMutation } from '@tanstack/react-query';
import { BLOG_API, TEMP_POST_AUTO_SAVE } from 'apps/blog/constants';
import useToast from 'apps/blog/hooks/useToast';
import apiCall from 'apps/blog/utils/apiCall';
import { useRouter } from 'next/navigation';

type ApiRes<T> = {
  data: T;
  code: number;
};

type UpsertPost = { id: number; title: string; contents: string; categoryNo: number };

export const upsertPostApi = (postData: UpsertPost) => {
  return apiCall.post<ApiRes<{ categoryNo: number; postNo: number }>>(`${BLOG_API}/post`, postData);
};

export const useUpsertPost = () => {
  const { showToast } = useToast();
  const router = useRouter();

  const upsertPostMutate = useMutation({
    mutationFn: upsertPostApi,
    onSuccess: (res) => {
      localStorage.removeItem(TEMP_POST_AUTO_SAVE);
      showToast('글 작성이 완료되었습니다.');
      const { categoryNo, postNo } = res.data.data;
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
