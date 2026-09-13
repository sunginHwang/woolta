'use client';

import { uploadImage } from '@common';
import { useCallback } from 'react';

/**
 * 본문 이미지 업로드.
 *
 * 업로드는 woolta-api 의 공용 image 도메인이 맡고, 조회 URL(image.woolta.com)은 서버가 돌려준다.
 * 실패는 조용히 삼키지 않고 사용자에게 알린 뒤 빈 문자열을 돌려준다 —
 * 에디터가 빈 URL 을 본문에 넣지 않도록 호출부가 판단한다.
 */
export const saveImageAndGetImageUrl = async (imageFile: File) => {
  try {
    const { imageUrl } = await uploadImage(imageFile, { type: 'blog' });

    return imageUrl;
  } catch (error) {
    alert(error instanceof Error ? error.message : '이미지 업로드에 실패하였습니다.');

    return '';
  }
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
