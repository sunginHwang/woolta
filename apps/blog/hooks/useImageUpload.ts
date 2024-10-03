import { useCallback } from 'react';

import apiCall from '../utils/api';
import config from '../utils/config';

export const saveImageAndGetImageUrl = async (imageFile: File) => {
  const data = new FormData();
  data.append('imageFile', imageFile);

  try {
    const result = await apiCall.post('/file/upload/image', data);

    if (result.status === 200 && result.data.code === 'SUCCESS') {
      const savedImageUrl = `${config.imageApiUrl}/${result.data.data.originFileName}`;
      return savedImageUrl;
    } else {
      alert('이미지 업로드에 실패하였습니다.');
    }
  } catch (e) {
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
