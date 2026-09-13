import { getGraphqlHost } from './graphqlFetch';

/**
 * 이미지·동영상 업로드.
 *
 * 업로드만 woolta-api 가 맡고 **조회는 nginx(image.woolta.com)가 디스크를 직접 읽는다** —
 * 그래서 여기서 돌려주는 URL 은 API 호스트가 아니라 이미지 호스트를 가리킨다.
 *
 * GraphQL 이 아니라 REST 인 이유는 multipart 다. 호스트는 GraphQL 과 같은 기준을 쓴다.
 */
const UPLOAD_PATH = '/image/upload';

/** 업로드한 앱. 서버 APP_TYPES 와 맞춘다 — 미지정이면 서버가 'etc' 로 분류한다. */
export type UploadAppType = 'blog' | 'memo' | 'bank' | 'article' | 'todo' | 'calendar' | 'schedule' | 'etc';

export interface UploadedImage {
  originFileName: string;
  fileName: string;
  fileExt: string;
  mimeType: string;
  size: number;
  imageUrl: string;
  /** 썸네일을 만들 수 없는 형식(동영상)이면 없다 */
  thumbImageUrl?: string;
}

export interface UploadImageOptions {
  type: UploadAppType;
  /** 80x80 썸네일을 함께 만들지. 동영상은 요청해도 만들어지지 않는다. */
  thumbnail?: boolean;
}

export class ImageUploadError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

/**
 * 실패는 던진다 — 호출부가 토스트를 띄울지 저장을 막을지 정한다.
 * (버킷 저장은 업로드가 실패하면 mutation 자체를 보내지 않는다)
 */
export const uploadImage = async (file: File, { type, thumbnail = false }: UploadImageOptions) => {
  const body = new FormData();
  body.append('file', file);
  body.append('type', type);

  if (thumbnail) {
    body.append('thumbnail', 'true');
  }

  const res = await fetch(`${getGraphqlHost()}${UPLOAD_PATH}`, {
    method: 'POST',
    credentials: 'include',
    body,
  });

  const json = (await res.json().catch(() => null)) as { code?: string; message?: string; data?: UploadedImage } | null;

  if (!res.ok || json?.code !== 'SUCCESS' || !json.data) {
    throw new ImageUploadError(
      json?.message ?? '이미지 업로드에 실패했습니다.',
      json?.code ?? 'UNKNOWN_ERROR',
      res.status,
    );
  }

  return json.data;
};
