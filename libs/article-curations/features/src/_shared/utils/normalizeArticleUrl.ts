/**
 * 입력한 아티클 링크를 저장용 URL 로 정규화한다.
 * 스킴이 없으면 https:// 를 붙이고, 유효하지 않은 URL 이면 null 을 반환한다.
 */
export const normalizeArticleUrl = (rawUrl: string) => {
  const trimmedUrl = rawUrl.trim();
  if (trimmedUrl.length === 0) {
    return null;
  }

  const urlWithScheme = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;
  try {
    return new URL(urlWithScheme).toString();
  } catch {
    return null;
  }
};
