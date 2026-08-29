'use client';

import { useCallback } from 'react';
import { getApiClient } from '../../_shared/api';
import { getBlogConfig } from '../../_shared/config';

export const saveImageAndGetImageUrl = async (imageFile: File) => {
  const data = new FormData();
  data.append('imageFile', imageFile);

  try {
    const result = await getApiClient().post('/file/upload/image', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (result.status === 200 && result.data.code === 'SUCCESS') {
      const { imageApiUrl } = getBlogConfig();
      const savedImageUrl = `${imageApiUrl}/${result.data.data.originFileName}`;
      return savedImageUrl;
    } else {
      alert('이미지 업로드에 실패하였습니다.');
    }
  } catch {
    alert('이미지 업로드에 실패하였습니다.');
  }

  return '';
};

export default function useImageUpload() {
  const onImageUpload = useCallback(async (file: File) => {
    const savedImageUrl = await saveImageAndGetImageUrl(file);
    return savedImageUrl;
  }, []);

  return {
    onImageUpload,
  };
}
