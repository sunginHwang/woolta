'use client';

import { isUnauthenticatedError } from '@common/graphql';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type BucketListDetail,
  bucketListDetailKey,
  fetchBucketListDetail,
  useCompleteBucketListMutation,
  useCreateBucketListTodoMutation,
  useDeleteBucketListMutation,
  useDeleteBucketListTodoMutation,
  useUpdateBucketListTodoCompleteMutation,
} from '@woolta/woolbank-features';
import { useParams, useRouter } from 'next/navigation';
import { useConfirm } from '../../../../components/Confirm/ConfirmContext';
import { useToast } from '../../../../hooks/useToast';
import { useBucketList } from '../../main/hooks/useBucketList';

const ERROR_MSG = '다시 시도해 주세요.';

// 조회 타입은 생성 fragment 가 정본이다.
export type Bucket = BucketListDetail;
export type Todo = BucketListDetail['todoList'][number];

/**
 * 화면이 넘기는 todo 의 최소 형태.
 * 추가 시점에는 서버 id·bucketListId 가 아직 없으므로 전체 Todo 를 요구하지 않는다.
 */
export interface TodoInput {
  id: string;
  title: string;
  isComplete: boolean;
}

/**
 * 빈 상태 센티넬. 레거시가 `id: -1` 로 "없음"을 표현했고 화면이 그 값으로 빈 상태를 판단한다
 * (isEmpty). GraphQL id 는 문자열이라 '' 를 쓴다.
 */
const EMPTY_DATE = '1970-01-01T00:00:00.000Z';

export const initData = {
  id: '',
  title: '',
  description: '',
  // 고정값을 쓴다 — new Date() 를 쓰면 서버와 클라이언트가 다른 값을 만들어 하이드레이션이 어긋난다
  completeDate: EMPTY_DATE,
  isComplete: false,
  imageUrl: null,
  thumbImageUrl: null,
  createdAt: EMPTY_DATE,
  updatedAt: EMPTY_DATE,
  todoList: [],
} as unknown as Bucket;

export const getBucketQueryKey = (id: string) => bucketListDetailKey(id);

/**
 * 없는 버킷은 빈 상태로 보여주되, **세션이 끊긴 것과 구분한다.**
 * 인증 오류까지 삼키면 로그아웃 상태가 "버킷 없음"으로 렌더된다.
 */
export const fetchBucket = async (bucketId: string) => {
  try {
    return (await fetchBucketListDetail(bucketId)) ?? initData;
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      throw error;
    }

    return initData;
  }
};

// TODO: todo 쪽 분리하자
export const useBucket = (id?: string | undefined) => {
  const queryClient = useQueryClient();
  const { replace } = useRouter();
  const { onToast } = useToast();
  const { openConfirm, setConfirmLoading } = useConfirm();
  const { bucketId } = useParams() as { bucketId: string };
  const { removeBucketById, updateBucketState } = useBucketList();
  const bucketIdByKey = id ?? bucketId;

  const {
    data = initData,
    isError,
    ...rest
  } = useQuery({
    queryKey: getBucketQueryKey(bucketIdByKey),
    queryFn: () => fetchBucket(bucketIdByKey),
    enabled: !!bucketIdByKey,
  });

  const onError = () => onToast(ERROR_MSG);
  const onSettled = () => setConfirmLoading(false);

  /**
   * 레거시는 setQueryData 로 todoList 를 제자리 변경하고 같은 참조를 반환했다 —
   * React Query 가 변화를 못 알아채 리렌더를 건너뛸 수 있었다.
   * 상세를 무효화해 서버를 정본으로 삼는다.
   */
  const invalidateDetail = () =>
    queryClient.invalidateQueries({ queryKey: getBucketQueryKey(bucketIdByKey), exact: true });

  const removeBucketMutate = useDeleteBucketListMutation();
  const completeBucketMutation = useCompleteBucketListMutation();
  const saveMutation = useCreateBucketListTodoMutation({ onSuccess: invalidateDetail });
  const removeMutation = useDeleteBucketListTodoMutation({ onSuccess: invalidateDetail });
  const updateStateMutation = useUpdateBucketListTodoCompleteMutation({ onSuccess: invalidateDetail });

  const addTodo = async (todo: TodoInput) => {
    saveMutation.mutate(
      // 서버는 bucketListId 를 Int 로 받는다 (라우트 파라미터는 문자열)
      { input: { bucketListId: Number(bucketIdByKey), title: todo.title, isComplete: todo.isComplete } },
      { onError },
    );
  };

  const removeTodo = async (todoId: string) => {
    removeMutation.mutate({ input: { todoId } }, { onError });
  };

  const toggleTodoState = async (todo: TodoInput) => {
    // 뒤집은 값을 그대로 보낸다 — 여기서 또 부정하면 서버에는 원래 값이 가서 캐시와 어긋난다
    updateStateMutation.mutate({ input: { todoId: todo.id, isComplete: !todo.isComplete } }, { onError });
  };

  const removeBucket = async () => {
    const isConfirm = await openConfirm({ message: '정말 삭제하시겠습니까?', useAutoClose: false });

    if (!isConfirm) {
      return;
    }

    setConfirmLoading(true);
    removeBucketMutate.mutate(
      { input: { id: bucketIdByKey } },
      {
        onSuccess: () => {
          // 상세·목록 캐시 싱크 조정
          queryClient.setQueryData(getBucketQueryKey(bucketIdByKey), initData);
          removeBucketById();
          onToast('삭제 되었습니다.');
          replace('/bucket-list');
        },
        onError,
        onSettled,
      },
    );
  };

  const completeBucket = async () => {
    const isConfirm = await openConfirm({ message: '목표를 달성하시겠습니까?', useAutoClose: false });

    if (!isConfirm) {
      return;
    }

    setConfirmLoading(true);
    completeBucketMutation.mutate(
      { input: { id: bucketIdByKey } },
      {
        onSuccess: () => {
          invalidateDetail();
          updateBucketState();
          onToast('목표를 달성하신걸 축하드립니다. :)');
        },
        onError,
        onSettled,
      },
    );
  };

  const inValidQuery = (targetId: string) =>
    queryClient.invalidateQueries({ queryKey: getBucketQueryKey(targetId), exact: true });

  return {
    bucket: data,
    ...rest,
    isError,
    isEmpty: data.id === initData.id && !isError,
    inValidQuery,
    addTodo,
    removeTodo,
    toggleTodoState,
    removeBucket,
    completeBucket,
    addLoading: saveMutation.isPending,
    updateLoading: updateStateMutation.isPending,
  };
};
