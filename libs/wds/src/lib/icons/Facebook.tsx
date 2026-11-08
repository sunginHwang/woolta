import { createIcon } from './createIcon';

/** 페이스북 로고. 소셜 로그인 버튼용 — color 로 글리프 색을 준다(버튼 배경은 호출부 담당) */
export const IconFacebook = createIcon({
  name: 'IconFacebook',
  viewBox: '0 0 20 20',
  render: (color) => (
    <path
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
      d='M7.84 20v-8.945H4.844V7.5H7.84V4.7C7.84 1.655 9.7 0 12.414 0c1.3 0 2.418.098 2.742.14v3.18h-1.883c-1.476 0-1.761.703-1.761 1.73V7.5h3.332l-.457 3.555h-2.875V20'
    />
  ),
});
