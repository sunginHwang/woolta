import axios from 'axios';

const ACCESS_TOKEN_COOKIE = '_WOOLTA_USER_';

const getAccessToken = () => {
  if (typeof document === 'undefined') {
    return '';
  }

  const matched = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${ACCESS_TOKEN_COOKIE}=`));
  return matched?.split('=')[1] ?? '';
};

/**
 * 이미지 파일을 업로드하고 접근 가능한 URL을 반환한다. 실패 시 null.
 * blog와 동일한 업로드 API(POST {BLOG_API}/file/upload/image → {IMAGE_API}/{originFileName})를 사용한다.
 */
export const uploadMemoImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('imageFile', imageFile);

  const accessToken = getAccessToken();

  try {
    const { status, data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BLOG_API_BROWSER ?? process.env.NEXT_PUBLIC_BLOG_API}/file/upload/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
      },
    );

    if (status === 200 && data.code === 'SUCCESS') {
      return `${process.env.NEXT_PUBLIC_IMAGE_API}/${data.data.originFileName}`;
    }
    return null;
  } catch {
    return null;
  }
};
