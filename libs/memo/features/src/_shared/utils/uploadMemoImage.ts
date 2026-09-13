import { uploadImage } from '@common';

/**
 * 메모 본문 이미지를 업로드하고 접근 가능한 URL 을 반환한다. 실패 시 null.
 *
 * 예전에는 blog 의 레거시 Spring API 를 빌려 썼고 `_WOOLTA_USER_` 쿠키를 Authorization 헤더로
 * 직접 실어 보냈다. 지금은 woolta-api 의 공용 image 도메인을 쓰며 인증은 세션 쿠키로만 오간다.
 */
export const uploadMemoImage = async (imageFile: File) => {
  try {
    const { imageUrl } = await uploadImage(imageFile, { type: 'memo' });

    return imageUrl;
  } catch {
    return null;
  }
};
