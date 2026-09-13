'use client';

import { useMutation } from '@tanstack/react-query';
import { uploadBucketImage, useCreateBucketListMutation, useUpdateBucketListMutation } from '@woolta/woolbank-features';
import type { BucketForm } from '../store';

/**
 * 버킷 생성·수정.
 *
 * 레거시는 multipart 한 방에 이미지까지 함께 보냈지만 GraphQL 입력은 imageUrl 을 문자열로 받는다.
 * 그래서 2단계다: 이미지가 있으면 먼저 업로드해 URL 두 개를 받고, 그 값을 mutation 에 넘긴다.
 * 업로드가 실패하면 mutation 을 보내지 않는다 — 이미지 없이 저장돼 버리는 쪽이 더 혼란스럽다.
 */
export const useUpsertBucket = () => {
  const createMutation = useCreateBucketListMutation();
  const updateMutation = useUpdateBucketListMutation();

  const upsertBucketMutate = useMutation({
    mutationFn: async (bucketForm: BucketForm) => {
      const uploaded = bucketForm.mainImgFile ? await uploadBucketImage(bucketForm.mainImgFile) : null;

      const common = {
        title: bucketForm.title,
        description: bucketForm.description,
        completeDate: bucketForm.completeDate,
        // 새 이미지를 안 올렸으면 기존 값을 유지한다
        imageUrl: uploaded?.imageUrl ?? bucketForm.imageUrl ?? null,
        thumbImageUrl: uploaded?.thumbImageUrl ?? bucketForm.thumbImageUrl ?? null,
      };

      const isUpdate = bucketForm.id !== undefined && String(bucketForm.id) !== '';

      if (isUpdate) {
        const res = await updateMutation.mutateAsync({ input: { id: String(bucketForm.id), ...common } });

        return { data: { bucketListId: res.updateBucketList.id } };
      }

      const res = await createMutation.mutateAsync({
        input: {
          ...common,
          todoList: bucketForm.todoList.map(({ title, isComplete }) => ({ title, isComplete })),
        },
      });

      return { data: { bucketListId: res.createBucketList.id } };
    },
  });

  return {
    upsertBucketMutate,
  };
};
