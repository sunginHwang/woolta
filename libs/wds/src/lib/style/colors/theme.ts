import { DefaultTheme } from 'styled-components';
import { type ShadowTokens } from '../shadows';
import { colorVars, shadowVars } from '../tokens.stylex';
import { zIndex } from '../zIndex';
import { palette } from './palette';
import type { ColorType, ThemeType } from './types';

// --- Light Legacy Colors ---
export const lightLegacyColors: Record<string, string> = {
  // Primitives
  white: palette.white,
  black: palette.black,
  gray050: palette.gray[50],
  gray100: palette.gray[100],
  gray150: palette.gray[150],
  gray200: palette.gray[200],
  gray300: palette.gray[300],
  gray400: palette.gray[400],
  gray500: palette.gray[500],
  gray600: palette.gray[600],
  gray650: palette.gray[650],
  gray700: palette.gray[700],
  gray800: palette.gray[800],
  gray900: palette.gray[900],
  gray950: palette.gray[950],
  pink030: palette.pink[30],
  pink050: palette.pink[50],
  pink100: palette.pink[100],
  pink150: palette.pink[150],
  pink200: palette.pink[200],
  pink300: palette.pink[300],
  pink400: palette.pink[400],
  pink500: palette.pink[500],
  pink600: palette.pink[600],
  pink700: palette.pink[700],
  pink800: palette.pink[800],
  pink900: palette.pink[900],
  blue050: palette.blue[50],
  blue100: palette.blue[100],
  blue150: palette.blue[150],
  blue200: palette.blue[200],
  blue300: palette.blue[300],
  blue400: palette.blue[400],
  blue500: palette.blue[500],
  blue550: palette.blue[550],
  blue600: palette.blue[600],
  blue700: palette.blue[700],
  blue800: palette.blue[800],
  blue900: palette.blue[900],
  red050: palette.red[50],
  red100: palette.red[100],
  red150: palette.red[150],
  red500: palette.red[500],
  yellow500: palette.yellow[500],
  orange500: palette.orange[500],
  orange600: palette.orange[600],
  green200: palette.green[200],

  // Semantic aliases
  orangePrimary: palette.orange[600],
  yellow: palette.yellow[600],
  grayPrimary: palette.gray[800],
  graySecondary: palette.gray[700],
  grayTertiary: palette.gray[500],
  grayActive: palette.gray[900],
  grayInactive: palette.gray[600],
  grayDisabled: palette.gray[300],
  grayInactiveFilled: palette.gray[300],
  customGray: palette.gray[1000],
  border1: palette.gray[400],
  border2: palette.gray[300],
  border3: palette.gray[200],
  border4: palette.gray[100],
  bgPrimary: palette.gray[50],
  bgSecondary: palette.gray[100],
  pinkPrimary: palette.pink[600],
  pinkInactive: palette.pink[200],
  pinkDisabled: palette.pink[150],
  blogPrimary: palette.special.grayMain,
  grayMain: palette.special.grayMain,
};

// --- Dark Legacy Colors ---
export const darkLegacyColors: Record<string, string> = {
  // Primitives (same hex values in both themes)
  gray050: palette.gray[50],
  gray100: palette.gray[100],
  gray150: palette.gray[150],
  gray200: palette.gray[200],
  gray300: palette.gray[300],
  gray400: palette.gray[400],
  gray500: palette.gray[500],
  gray600: palette.gray[600],
  gray650: palette.gray[650],
  gray700: palette.gray[700],
  gray800: palette.gray[800],
  gray900: palette.gray[900],
  gray950: palette.gray[950],
  pink030: palette.pink[30],
  pink050: palette.pink[50],
  pink100: palette.pink[100],
  pink150: palette.pink[150],
  pink200: palette.pink[200],
  pink300: palette.pink[300],
  pink400: palette.pink[400],
  pink500: palette.pink[500],
  pink600: palette.pink[600],
  pink700: palette.pink[700],
  pink800: palette.pink[800],
  pink900: palette.pink[900],
  blue050: palette.blue[50],
  blue100: palette.blue[100],
  blue150: palette.blue[150],
  blue200: palette.blue[200],
  blue300: palette.blue[300],
  blue400: palette.blue[400],
  blue500: palette.blue[500],
  blue550: palette.blue[550],
  blue600: palette.blue[600],
  blue700: palette.blue[700],
  blue800: palette.blue[800],
  blue900: palette.blue[900],
  red050: palette.red[50],
  red100: palette.red[100],
  red150: palette.red[150],
  red500: palette.red[500],
  yellow500: palette.yellow[500],
  orange500: palette.orange[500],
  orange600: palette.orange[600],
  green200: palette.green[200],

  // Semantic aliases (dark-adapted)
  white: '#1E1E1E',
  black: '#F5F5F5',
  orangePrimary: '#FF6B6B',
  yellow: palette.yellow[600],
  grayPrimary: '#E0E0E0',
  graySecondary: '#A0A0A0',
  grayTertiary: '#6B6B6B',
  grayActive: '#F5F5F5',
  grayInactive: '#787878',
  grayDisabled: '#4A4A4A',
  grayInactiveFilled: '#4A4A4A',
  customGray: '#4A5058',
  border1: '#3A3A3A',
  border2: '#2E2E2E',
  border3: '#252525',
  border4: '#1F1F1F',
  bgPrimary: '#121212',
  bgSecondary: '#1E1E1E',
  pinkPrimary: '#FF4D8A',
  pinkInactive: '#FF8AB5',
  pinkDisabled: '#804060',
  blogPrimary: 'rgba(30, 30, 30, 0.88)',
  grayMain: 'rgba(30, 30, 30, 0.88)',
};

/**
 * StyleX 토큰 브리지.
 * theme.colors 값을 실제 색상값 대신 tokens.stylex.ts 가 정의한 CSS 변수의 var() 참조로 채운다.
 * - styled-components(미이관 코드)와 StyleX(이관 코드)가 같은 토큰을 읽는다.
 * - 다크 테마는 ThemeProvider 가 아니라 html 의 data-theme 속성이 결정한다
 *   (darkTokens.ts 오버라이드가 :root[data-theme='dark'] 에서 변수 재정의).
 *   따라서 light/dark 테마 객체는 동일한 var() 참조를 공유한다.
 */
const bridgeVars = <K extends string>(vars: Record<string, string>, prefix: string) =>
  Object.fromEntries(
    Object.entries(vars)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => [key.slice(prefix.length), value]),
  ) as Record<K, string>;

const bridgedColors = bridgeVars<ColorType>(colorVars as unknown as Record<string, string>, '--color-');

const bridgedShadows: ShadowTokens = {
  overlay: shadowVars['--shadow-overlay'],
  popover: shadowVars['--shadow-popover'],
};

const sharedTheme: DefaultTheme = {
  zIndex,
  shadows: bridgedShadows,
  colors: bridgedColors,
};

export const theme: Record<ThemeType, DefaultTheme> = {
  light: sharedTheme,
  dark: sharedTheme,
};

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Record<ColorType, string>;
    zIndex: typeof zIndex;
    shadows: ShadowTokens;
  }
}
