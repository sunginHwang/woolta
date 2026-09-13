'use client';

import { uploadImage } from '@common';

/**
 * 버킷 대표 이미지 업로드.
 *
 * 레거시는 `POST/PUT /bucket-list` 가 multipart 로 이미지까지 함께 받았지만,
 * GraphQL 입력은 imageUrl/thumbImageUrl 을 **문자열로** 받는다. 그래서 2단계가 된다:
 * 먼저 올려 URL 두 개를 받고(서버가 80x80 썸네일을 만든다), 그 값을 mutation 에 넘긴다.
 *
 * bucketListApi 와 분리한 이유는 RSC 다 — 그쪽은 프리페치에서 import 하므로
 * 클라이언트 배럴(@common)을 끌어오면 안 된다.
 */
export interface UploadedBucketImage {
  imageUrl: string;
  thumbImageUrl: string;
}

export const uploadBucketImage = async (file: File): Promise<UploadedBucketImage> => {
  const { imageUrl, thumbImageUrl } = await uploadImage(file, { type: 'bank', thumbnail: true });

  // 정지 이미지는 항상 썸네일이 생기지만, 못 만든 형식이면 원본으로 대체한다
  return { imageUrl, thumbImageUrl: thumbImageUrl ?? imageUrl };
};
