'use client';

import { getGraphqlHost } from '@common/graphql';
import { useCallback } from 'react';
import { getBlogConfig } from '../../_shared/config';

/**
 * 본문 이미지 업로드.
 *
 * 업로드만은 GraphQL 이 아니라 REST 다 — multipart 파일 전송이라 그쪽이 자연스럽다.
 * 다만 호스트는 woolta-api 로 통일한다(`getGraphqlHost`). 레거시 Spring 의 `/file/upload/image` 와
 * 경로만 다르고(`/blog/file/upload/image`) 응답 봉투는 같다.
 *
 * 쿠키 세션을 쓰므로 credentials 를 실어 보낸다 — Authorization 헤더는 더 이상 쓰지 않는다.
 */
const UPLOAD_PATH = '/blog/file/upload/image';

interface UploadResponse {
  code: string;
  data?: { originFileName: string };
}

export const saveImageAndGetImageUrl = async (imageFile: File) => {
  const body = new FormData();
  body.append('imageFile', imageFile);

  try {
    const res = await fetch(`${getGraphqlHost()}${UPLOAD_PATH}`, {
      method: 'POST',
      credentials: 'include',
      body,
    });

    const json = (await res.json().catch(() => null)) as UploadResponse | null;

    if (res.ok && json?.code === 'SUCCESS' && json.data) {
      const { imageApiUrl } = getBlogConfig();
      return `${imageApiUrl}/${json.data.originFileName}`;
    }

    alert('이미지 업로드에 실패하였습니다.');
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
