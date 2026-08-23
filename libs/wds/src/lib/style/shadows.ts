export type ShadowTokens = {
  /** 리스트/페이지 위에 떠 있는 입력창·시트용 그림자 */
  overlay: string;
  /** 버튼 등에서 열리는 작은 팝오버용 그림자 */
  popover: string;
};

/**
 * 라이트 테마 그림자.
 * 밝은 배경에서는 검정 반투명 그림자만으로 충분히 떠 보인다.
 */
export const lightShadows: ShadowTokens = {
  overlay: '0 1.2rem 3.2rem rgba(0, 0, 0, 0.18), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.1)',
  popover: '0 0.4rem 1.6rem rgba(0, 0, 0, 0.15)',
};

/**
 * 다크 테마 그림자.
 * 어두운 배경에서는 검정 그림자가 보이지 않으므로, 짙은 그림자에
 * 흰색 반투명 링(spread only)을 더해 표면 경계를 드러낸다.
 */
export const darkShadows: ShadowTokens = {
  overlay:
    '0 1.6rem 4rem rgba(0, 0, 0, 0.64), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.48), 0 0 0 0.1rem rgba(255, 255, 255, 0.12)',
  popover: '0 0.4rem 1.6rem rgba(0, 0, 0, 0.56), 0 0 0 0.1rem rgba(255, 255, 255, 0.1)',
};
