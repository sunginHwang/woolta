'use client';
import dayjs from 'dayjs';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useBucket } from '../../detail/hooks/useBucket';
import { bucketFormAtom, bucketFormStepAtom } from '../store';
import { CompleteDateForm } from './CompleteDateForm';
import { ImageForm } from './ImageForm';
import { InfoForm } from './InfoForm';
import { TodoListForm } from './TodoListForm';

const FORM_COMPONENTS = [InfoForm, CompleteDateForm, ImageForm, TodoListForm];

export const SaveForm = () => {
  const params = useSearchParams();
  const bucketFormStep = useAtomValue(bucketFormStepAtom);
  const setBucketForm = useSetAtom(bucketFormAtom);

  const bucketId = params.get('bucketId') ? String(params.get('bucketId')) : undefined;
  const { bucket } = useBucket(bucketId);

  useEffect(() => {
    if (bucket.id !== -1) {
      setBucketForm({
        id: bucket.id,
        title: bucket.title,
        description: bucket.description,
        completeDate: dayjs(bucket.completeDate).format('YYYY-MM-DD'),
        thumbImageUrl: bucket.thumbImageUrl,
        imageUrl: bucket.imageUrl,
        mainImgFile: null,
        todoList: [],
      });
    }
  }, [bucket, setBucketForm]);

  return (
    <>
      {FORM_COMPONENTS.map((Component, index) => (
        <Component key={index} activeForm={bucketFormStep >= index + 1} />
      ))}
    </>
  );
};
