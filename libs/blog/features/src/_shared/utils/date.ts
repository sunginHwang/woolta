/**
 * 글 작성일 표기.
 *
 * 레거시 REST 는 `createdAt` 을 `"2018-10-21"` 로 내려줬지만 GraphQL 의 DateTime 스칼라는
 * `"2018-10-21T15:22:36.000Z"` 처럼 ISO 전체를 준다. 그대로 뿌리면 목록·상세에 시각까지 노출되므로
 * 표기 시점에 날짜만 남긴다.
 *
 * 서버가 보내는 값은 UTC 기준 문자열이라 `new Date()` 로 파싱해 로컬 타임존으로 옮기면
 * 자정 근처 글의 날짜가 하루 밀린다. 문자열 앞 10자만 잘라 서버가 기록한 날짜를 그대로 쓴다.
 */
const ISO_DATE_LENGTH = 10;

export const formatPostDate = (createdAt: string | null | undefined): string => {
  if (!createdAt) {
    return '';
  }

  const [datePart] = createdAt.split('T');

  return datePart.length === ISO_DATE_LENGTH ? datePart : createdAt;
};
