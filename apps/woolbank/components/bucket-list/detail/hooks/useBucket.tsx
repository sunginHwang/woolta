import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { deleteData, getData, postData, putData } from '../../../../utils/api';
import { useConfirm } from 'apps/woolbank/components/common/Confirm/ConfirmContext';

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

export const saveTodo = async (bucketId: string, todo: Todo): Promise<number> => {
  const { data } = await postData<{ todoId: number }>('/todo', {
    title: todo.title,
    isComplete: todo.isComplete,
    bucketListId: bucketId,
  });

  return data.todoId;
};

export const removeTodo = async (todoId: number) => {
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
export const useBucket = () => {
  const { openConfirm } = useConfirm();
  const queryClient = useQueryClient();
  const { bucketId } = useParams() as { bucketId: string };
  const {
    data = initData,
    isError,
    ...rest
  } = useQuery<Bucket>({
    queryKey: getBucketQueryKey(bucketId),
    queryFn: () => fetchBucket(bucketId),
    enabled: !!bucketId,
  });

  //TODO: toast 교체 필요
  const onError = () => alert(ERROR_MSG);

  const removeMutation = useMutation({ mutationFn: (todoId: number) => removeTodo(todoId) });
  const saveMutation = useMutation({ mutationFn: (todo: Todo) => saveTodo(bucketId, todo) });
  const updateStateMutation = useMutation({
    mutationFn: ({ todoId, isComplete }: { todoId: number; isComplete: boolean }) => {
      return updateTodoState(todoId, isComplete);
    },
  });

  // todo 생성
  const addTodo = async (todo: Todo) => {
    saveMutation.mutate(todo, {
      onSuccess: (todoId: number) => {
        const savedTodo: Todo = Object.assign(todo, { id: todoId });
        queryClient.setQueryData<Bucket | undefined>(getBucketQueryKey(bucketId), (prev) => {
          if (prev) {
            prev.todoList = [...prev.todoList, savedTodo];
          }
          return prev;
        });
      },
      onError,
    });
  };

  // todo 삭제
  const removeTodo = async (todoId: number) => {
    const isConfirm = await openConfirm({ message: '정말 삭제하시겠습니까?' });

    if (!isConfirm) {
      return;
    }

    removeMutation.mutate(todoId, {
      onSuccess: () => {
        queryClient.setQueryData<Bucket | undefined>(getBucketQueryKey(bucketId), (prev) => {
          if (prev !== undefined) {
            prev.todoList = prev?.todoList.filter((todo) => todoId !== todo.id);
          }
          return prev;
        });
      },
      onError,
    });
  };

  // todo 완료 상태 변경
  const toggleTodoState = async (todo: Todo) => {
    const toggleTodo = Object.assign({}, todo);
    toggleTodo.isComplete = !toggleTodo.isComplete;

    updateStateMutation.mutate(
      { todoId: toggleTodo.id, isComplete: !toggleTodo.isComplete },
      {
        onSuccess: () => {
          queryClient.setQueryData<Bucket | undefined>(getBucketQueryKey(bucketId), (prev) => {
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

  return {
    bucket: data,
    ...rest,
    isError,
    isEmpty: data.id === initData.id && !isError,
    addTodo,
    removeTodo,
    toggleTodoState,
    addLoading: saveMutation.isPending,
    updateLoading: updateStateMutation.isPending,
  };
};
