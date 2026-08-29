/**
 * 다크 테마 토큰 오버라이드.
 * tokens.stylex.ts(라이트 기본값)의 CSS 변수를 `:root[data-theme='dark']` 에서 재정의한다.
 * 라이트와 값이 같은 키는 생략되어 있다.
 */
export const darkTokenOverrides: Record<string, string> = {
  '--color-white': '#1E1E1E',
  '--color-black': '#F5F5F5',
  '--color-orangePrimary': '#FF6B6B',
  '--color-grayPrimary': '#E0E0E0',
  '--color-graySecondary': '#A0A0A0',
  '--color-grayTertiary': '#6B6B6B',
  '--color-grayActive': '#F5F5F5',
  '--color-grayInactive': '#787878',
  '--color-grayDisabled': '#4A4A4A',
  '--color-grayInactiveFilled': '#4A4A4A',
  '--color-customGray': '#4A5058',
  '--color-border1': '#3A3A3A',
  '--color-border2': '#2E2E2E',
  '--color-border3': '#252525',
  '--color-border4': '#1F1F1F',
  '--color-bgPrimary': '#121212',
  '--color-bgSecondary': '#1E1E1E',
  '--color-pinkPrimary': '#FF4D8A',
  '--color-pinkInactive': '#FF8AB5',
  '--color-pinkDisabled': '#804060',
  '--color-blogPrimary': 'rgba(30, 30, 30, 0.88)',
  '--color-grayMain': 'rgba(30, 30, 30, 0.88)',
  '--color-textPrimary': '#E0E0E0',
  '--color-textSecondary': '#A0A0A0',
  '--color-textTertiary': '#6B6B6B',
  '--color-textDisabled': '#4A4A4A',
  '--color-textInverse': '#242424',
  '--color-textActive': '#F5F5F5',
  '--color-textInactive': '#787878',
  '--color-bgPage': '#121212',
  '--color-bgSurface': '#1E1E1E',
  '--color-bgSurfaceSecondary': '#2A2A2A',
  '--color-bgElevated': '#333333',
  '--color-bgOverlay': 'rgba(0, 0, 0, 0.6)',
  '--color-bgInverse': '#F5F5F5',
  '--color-borderDefault': '#3A3A3A',
  '--color-borderSubtle': '#2E2E2E',
  '--color-borderStrong': '#555555',
  '--color-borderFaint': '#1F1F1F',
  '--color-interactivePrimary': '#FF6B6B',
  '--color-interactivePrimaryHover': '#FF5252',
  '--color-interactivePrimaryDisabled': '#4A4A4A',
  '--color-brandPrimary': '#FF4D8A',
  '--color-brandLight': '#FF8AB5',
  '--color-brandDisabled': '#804060',
  '--color-statusSuccess': '#6BD975',
  '--color-statusWarning': '#FFD54F',
  '--color-statusError': '#FF5252',
  '--color-statusInfo': '#6B8AFF',
  '--shadow-overlay': '0 1.6rem 4rem rgba(0, 0, 0, 0.64), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.48), 0 0 0 0.1rem rgba(255, 255, 255, 0.12)',
  '--shadow-popover': '0 0.4rem 1.6rem rgba(0, 0, 0, 0.56), 0 0 0 0.1rem rgba(255, 255, 255, 0.1)',
};

/** `:root[data-theme='dark'] { ... }` 블록 안에 넣을 CSS 변수 선언 문자열 */
export const darkThemeCssVariables = Object.entries(darkTokenOverrides)
  .map(([name, value]) => `${name}: ${value};`)
  .join('\n');
