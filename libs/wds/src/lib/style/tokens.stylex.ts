import * as stylex from '@stylexjs/stylex';

/**
 * WDS 디자인 토큰 (StyleX defineVars).
 *
 * - 키를 CSS 변수명 그대로('--color-*') 사용해 생성되는 변수 이름을 예측 가능하게 한다.
 * - 값은 라이트 테마 기준. 다크 테마는 colors/darkTokens.ts 의 오버라이드가
 *   `:root[data-theme='dark']` 에서 같은 변수를 재정의한다.
 * - 키가 '--' 로 시작하면 StyleX 가 그 이름을 그대로 CSS 변수로 쓴다. 덕분에
 *   자손 선택자 때문에 CSS Module 로 남은 스타일도 var(--color-*) 로 같은 토큰을 읽는다.
 *
 * ※ 이 파일은 scripts 없이 관리한다 — 값 수정 시 darkTokens.ts, palette.ts 와 동기 유지.
 * ※ StyleX 제약: defineVars 는 *.stylex.ts 파일에서만 선언 가능, 다른 모듈 import 금지(리터럴만).
 */

export const colorVars = stylex.defineVars({
  '--color-white': '#FFFFFF',
  '--color-black': '#000000',
  '--color-gray050': '#FBFBFB',
  '--color-gray100': '#F4F4F4',
  '--color-gray150': '#F0F0F0',
  '--color-gray200': '#E9E9E9',
  '--color-gray300': '#E1E1E1',
  '--color-gray400': '#D3D3D3',
  '--color-gray500': '#B5B5B5',
  '--color-gray600': '#919191',
  '--color-gray650': '#5E666E',
  '--color-gray700': '#6D6D6D',
  '--color-gray800': '#484848',
  '--color-gray900': '#242424',
  '--color-gray950': '#121212',
  '--color-pink030': '#FFF7FA',
  '--color-pink050': '#FFEDF3',
  '--color-pink100': '#FFDEEA',
  '--color-pink150': '#FFCBDE',
  '--color-pink200': '#FFB8D2',
  '--color-pink300': '#FF92BA',
  '--color-pink400': '#FF6AA0',
  '--color-pink500': '#FF347D',
  '--color-pink600': '#E62F71',
  '--color-pink700': '#CF2A66',
  '--color-pink800': '#A72253',
  '--color-pink900': '#871C43',
  '--color-blue050': '#F2F4FF',
  '--color-blue100': '#E1E5FF',
  '--color-blue150': '#C7D0FF',
  '--color-blue200': '#B2BDFF',
  '--color-blue300': '#8C9EFF',
  '--color-blue400': '#536DFE',
  '--color-blue500': '#536DFE',
  '--color-blue550': '#4864FF',
  '--color-blue600': '#445CD1',
  '--color-blue700': '#384BA4',
  '--color-blue800': '#2D3A7A',
  '--color-blue900': '#232A52',
  '--color-red050': '#fff5f6',
  '--color-red100': '#ffebed',
  '--color-red150': '#ffdbdf',
  '--color-red500': '#f03e3e',
  '--color-yellow500': '#FEE700',
  '--color-orange500': '#FFA93B',
  '--color-orange600': '#f25e5e',
  '--color-green200': '#6E827F',
  '--color-orangePrimary': '#f25e5e',
  '--color-yellow': '#FEC600',
  '--color-grayPrimary': '#484848',
  '--color-graySecondary': '#6D6D6D',
  '--color-grayTertiary': '#B5B5B5',
  '--color-grayActive': '#242424',
  '--color-grayInactive': '#919191',
  '--color-grayDisabled': '#E1E1E1',
  '--color-grayInactiveFilled': '#E1E1E1',
  '--color-customGray': '#3A3E46',
  '--color-border1': '#D3D3D3',
  '--color-border2': '#E1E1E1',
  '--color-border3': '#E9E9E9',
  '--color-border4': '#F4F4F4',
  '--color-bgPrimary': '#FBFBFB',
  '--color-bgSecondary': '#F4F4F4',
  '--color-pinkPrimary': '#E62F71',
  '--color-pinkInactive': '#FFB8D2',
  '--color-pinkDisabled': '#FFCBDE',
  '--color-blogPrimary': 'rgba(255, 255, 255, 0.88)',
  '--color-grayMain': 'rgba(255, 255, 255, 0.88)',
  '--color-textPrimary': '#484848',
  '--color-textSecondary': '#6D6D6D',
  '--color-textTertiary': '#B5B5B5',
  '--color-textDisabled': '#E1E1E1',
  '--color-textInverse': '#FFFFFF',
  '--color-textActive': '#242424',
  '--color-textInactive': '#919191',
  '--color-bgPage': '#FBFBFB',
  '--color-bgSurface': '#FFFFFF',
  '--color-bgSurfaceSecondary': '#F4F4F4',
  '--color-bgElevated': '#F4F4F4',
  '--color-bgOverlay': 'rgba(0, 0, 0, 0.5)',
  '--color-bgInverse': '#242424',
  '--color-borderDefault': '#D3D3D3',
  '--color-borderSubtle': '#E1E1E1',
  '--color-borderStrong': '#919191',
  '--color-borderFaint': '#F4F4F4',
  '--color-interactivePrimary': '#f25e5e',
  '--color-interactivePrimaryHover': '#f03e3e',
  '--color-interactivePrimaryDisabled': '#E1E1E1',
  '--color-brandPrimary': '#E62F71',
  '--color-brandLight': '#FFB8D2',
  '--color-brandDisabled': '#FFCBDE',
  '--color-statusSuccess': '#5ac366',
  '--color-statusWarning': '#FEC600',
  '--color-statusError': '#f03e3e',
  '--color-statusInfo': '#536DFE',
});

export const shadowVars = stylex.defineVars({
  '--shadow-overlay': '0 1.2rem 3.2rem rgba(0, 0, 0, 0.18), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.1)',
  '--shadow-popover': '0 0.4rem 1.6rem rgba(0, 0, 0, 0.15)',
});

/**
 * z-index 토큰 (컴파일 타임 상수).
 * stylex.create 안에서는 일반 모듈 import 값을 쓸 수 없어 defineConsts 로 제공한다.
 * 값은 zIndex.ts 와 동기 유지.
 */
export const zIndexConsts = stylex.defineConsts({
  navigationBar: '100',
  header: '100',
  phase: '300',
  floatButton: '400',
  layer: '450',
  modalDeem: '500',
  fullDeem: '510',
  notification: '600',
});
