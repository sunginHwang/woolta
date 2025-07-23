import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '../../../../hooks/useToast';
import { deleteData, getData, postData, putData } from '../../../../utils/api';
import { useConfirm } from '../../../../components/confirm/ConfirmContext';
import { useBucketList } from '../../main/hooks/useBucketList';

const ERROR_MSG = '다시 시도해 주세요.';

export interface Bucket {
  id: number;
  title: string;
  description: string;
  completeDate: Date;
  imageUrl?: string;
  thumbImageUrl?: string;
  userId: number;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  todoList: Todo[];
}

export interface Todo {
  id: number;
  title: string;
  isComplete: boolean;
}

export const initData: Bucket = {
  id: -1,
  title: '',
  description: '',
  completeDate: new Date(),
  userId: -1,
  isComplete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  todoList: [],
};

const BUCKET_QUERY_KEY = 'GetBucket';

/*
 * 버킷리스트 조회
 * */
export const fetchBucket = async (bucketId: string) => {
  try {
    const { data } = await getData<Bucket>(`bucket-list/${bucketId}`);

    return {
      ...data,
      completeDate: data.completeDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch {
    return initData;
  }
};

export const deleteBucket = async (bucketId: number) => {
  const { data } = await deleteData<number>(`/bucket-list/${bucketId}`);
  return data;
};

export const completeBucketState = (bucketId: number) => {
  return putData(`/bucket-list/${bucketId}/complete`);
};

export const saveTodo = async (bucketId: string, todo: Todo): Promise<number> => {
  const { data } = await postData<{ todoId: number }>('/todo', {
    title: todo.title,
    isComplete: todo.isComplete,
    bucketListId: bucketId,
  });

  return data.todoId;
};

export const deleteTodo = async (todoId: number) => {
  const { data } = await deleteData<number>(`/todo/${todoId}`);
  return data;
};

export const updateTodoState = async (todoId: number, isComplete: boolean) => {
  const { data } = await putData<number>(`/todo/${todoId}`, {
    isComplete,
  });
  return data;
};

export const getBucketQueryKey = (id: string) => [BUCKET_QUERY_KEY, id];

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
  } = useQuery<Bucket>({
    queryKey: getBucketQueryKey(bucketIdByKey),
    queryFn: () => fetchBucket(bucketIdByKey),
    enabled: !!bucketIdByKey,
  });

  const onError = () => onToast(ERROR_MSG);
  const onSettled = () => setConfirmLoading(false);

  const removeBucketMutate = useMutation({ mutationFn: deleteBucket });
  const completeBucketMutation = useMutation({ mutationFn: completeBucketState });

  const removeMutation = useMutation({
    mutationFn: (todoId: number) => {
      return deleteTodo(todoId);
    },
  });
  const saveMutation = useMutation({ mutationFn: (todo: Todo) => saveTodo(bucketIdByKey, todo) });
  const updateStateMutation = useMutation({
    mutationFn: ({ todoId, isComplete }: { todoId: number; isComplete: boolean }) => {
      return updateTodoState(todoId, isComplete);
    },
  });

  const addTodo = async (todo: Todo) => {
    saveMutation.mutate(todo, {
      onSuccess: (todoId: number) => {
        const savedTodo: Todo = Object.assign(todo, { id: todoId });
        queryClient.setQueryData<Bucket | undefined>(getBucketQueryKey(bucketIdByKey), (prev) => {
          if (prev) {
            prev.todoList = [...prev.todoList, savedTodo];
          }
          return prev;
        });
      },
      onError,
    });
  };

  const removeTodo = async (todoId: number) => {
    removeMutation.mutate(todoId, {
      onSuccess: () => {
        queryClient.setQueryData<Bucket | undefined>(getBucketQueryKey(bucketIdByKey), (prev) => {
          if (prev !== undefined) {
            prev.todoList = prev?.todoList.filter((todo) => todoId !== todo.id);
          }
          return prev;
        });
      },
      onError,
    });
  };

  const toggleTodoState = async (todo: Todo) => {
    const toggleTodo = Object.assign({}, todo);
    toggleTodo.isComplete = !toggleTodo.isComplete;

    updateStateMutation.mutate(
      { todoId: toggleTodo.id, isComplete: !toggleTodo.isComplete },
      {
        onSuccess: () => {
          queryClient.setQueryData<Bucket | undefined>(getBucketQueryKey(bucketIdByKey), (prev) => {
            if (prev) {
              prev.todoList = prev.todoList.map((todo) => (toggleTodo.id !== todo.id ? todo : toggleTodo));
            }
            return prev;
          });
        },
        onError,
      },
    );
  };

  const removeBucket = async () => {
    const isConfirm = await openConfirm({ message: '정말 삭제하시겠습니까?', useAutoClose: false });

    if (isConfirm) {
      setConfirmLoading(true);
      removeBucketMutate.mutate(Number(bucketIdByKey), {
        onSuccess: () => {
          // 상세 페이지 및 리스트 페이지 캐시 싱크조정
          queryClient.setQueryData(getBucketQueryKey(bucketIdByKey), initData);
          removeBucketById(Number(bucketIdByKey));
          onToast('삭제 되었습니다.');
          replace('/bucket-list');
        },
        onError,
        onSettled,
      });
    }
  };

  const completeBucket = async () => {
    const isConfirm = await openConfirm({ message: '목표를 달성하시겠습니까?', useAutoClose: false });

    if (isConfirm) {
      setConfirmLoading(true);
      completeBucketMutation.mutate(Number(bucketIdByKey), {
        onSuccess: () => {
          // 상세 페이지 및 리스트 페이지 캐시 싱크조정
          queryClient.setQueryData<Bucket | undefined>(getBucketQueryKey(bucketIdByKey), (prev) => {
            if (prev) {
              prev.isComplete = true;
            }
            return prev;
          });
          updateBucketState(Number(bucketIdByKey));
          onToast('목표를 달성하신걸 축하드립니다. :)');
        },
        onError,
        onSettled,
      });
    }
  };

  const inValidQuery = (bucketId: string) => {
    queryClient.invalidateQueries({
      queryKey: getBucketQueryKey(bucketId),
      exact: true,
    });
  };

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
