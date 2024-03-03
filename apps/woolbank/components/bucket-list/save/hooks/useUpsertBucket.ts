import { useMutation } from '@tanstack/react-query';
import { postData, putData } from '../../../../utils/api';
import { BucketForm } from '../store';

export const updateBucketList = async (bucketListForm: BucketForm) => {
  const data = await new FormData();
  data.append('title', bucketListForm.title);
  data.append('description', bucketListForm.description);
  data.append('completeDate', bucketListForm.completeDate);

  if (bucketListForm.mainImgFile) {
    await data.append('image', bucketListForm.mainImgFile);
  }

  if (bucketListForm?.id && bucketListForm?.id > 0) {
    return postData(`/bucket-list/${bucketListForm.id}`, data);
  }

  data.append('todoList', JSON.stringify(bucketListForm.todoList));
  return postData('/bucket-list/', data);
};

export const useUpsertBucket = () => {
  const upsertBucketMutate = useMutation({ mutationFn: (bucket: BucketForm) => updateBucketList(bucket) });

  return {
    upsertBucketMutate,
  };
};
