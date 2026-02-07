import { palette } from './palette';
import type { LegacyColorKey } from './types';

// Re-export structured modules
export { palette } from './palette';
export { lightSemanticTokens, darkSemanticTokens } from './semanticTokens';
export { theme } from './theme';
export type { ColorType, ThemeType, SemanticColorTokens, LegacyColorKey } from './types';

// --- Individual color constants (backward compatibility) ---

export const brandColor = palette.pink[600];

export const white = palette.white;
export const black = palette.black;

export const gray050 = palette.gray[50];
export const gray100 = palette.gray[100];
export const gray150 = palette.gray[150];
export const gray200 = palette.gray[200];
export const gray300 = palette.gray[300];
export const gray400 = palette.gray[400];
export const gray500 = palette.gray[500];
export const gray600 = palette.gray[600];
export const gray650 = palette.gray[650];
export const gray700 = palette.gray[700];
export const gray800 = palette.gray[800];
export const gray900 = palette.gray[900];
export const gray950 = palette.gray[950];
export const gray1000 = palette.gray[1000];

export const pink030 = palette.pink[30];
export const pink050 = palette.pink[50];
export const pink100 = palette.pink[100];
export const pink150 = palette.pink[150];
export const pink200 = palette.pink[200];
export const pink300 = palette.pink[300];
export const pink400 = palette.pink[400];
export const pink500 = palette.pink[500];
export const pink600 = palette.pink[600];
export const pink700 = palette.pink[700];
export const pink800 = palette.pink[800];
export const pink900 = palette.pink[900];

export const blue050 = palette.blue[50];
export const blue100 = palette.blue[100];
export const blue150 = palette.blue[150];
export const blue200 = palette.blue[200];
export const blue300 = palette.blue[300];
export const blue400 = palette.blue[400];
export const blue500 = palette.blue[500];
export const blue550 = palette.blue[550];
export const blue600 = palette.blue[600];
export const blue700 = palette.blue[700];
export const blue800 = palette.blue[800];
export const blue900 = palette.blue[900];

export const red050 = palette.red[50];
export const red100 = palette.red[100];
export const red150 = palette.red[150];
export const red200 = palette.red[200];
export const red300 = palette.red[300];
export const red400 = palette.red[400];
export const red500 = palette.red[500];
export const red600 = palette.red[600];
export const red700 = palette.red[700];
export const red800 = palette.red[800];

export const green200 = palette.green[200];

export const yellow500 = palette.yellow[500];

export const orange500 = palette.orange[500];
export const orange600 = palette.orange[600];

export const safeGreen = palette.green[500];
export const warningRed = palette.red[500];
export const lightYellow = palette.special.lightYellow;
export const periwinkleBlue = palette.special.periwinkleBlue;
export const kakaoColor = palette.special.kakaoColor;
export const yellowReview = palette.yellow[600];

export const grayMain = palette.special.grayMain;
export const grayPrimary = gray800;
export const graySecondary = gray700;
export const grayTertiary = gray500;
export const grayActive = gray900;
export const grayInactive = gray600;
export const grayDisabled = gray300;
export const grayInactiveFilled = gray300;
export const customGray = gray1000;
export const border1 = gray400;
export const border2 = gray300;
export const border3 = gray200;
export const border4 = gray100;

export const bgPrimary = gray050;
export const bgSecondary = gray100;

export const pinkPrimary = pink600;
export const pinkInactive = pink200;
export const pinkDisabled = pink150;

export const blogPrimary = grayMain;

// --- Legacy `colors` record (backward compatibility) ---

export const colors: Record<LegacyColorKey, string> = {
  white,
  black,
  gray050,
  gray100,
  gray150,
  gray200,
  gray300,
  gray400,
  gray500,
  gray600,
  gray650,
  gray700,
  gray800,
  gray900,
  gray950,
  pink030,
  pink050,
  pink100,
  pink150,
  pink200,
  pink300,
  pink400,
  pink500,
  pink600,
  pink700,
  pink800,
  pink900,
  blue050,
  blue100,
  blue150,
  blue200,
  blue300,
  blue400,
  blue500,
  blue550,
  blue600,
  blue700,
  blue800,
  blue900,
  red050,
  red100,
  red150,
  red500,
  yellow: yellowReview,
  yellow500,
  orange500,
  orange600,
  orangePrimary: orange600,
  grayPrimary,
  graySecondary,
  grayTertiary,
  grayActive,
  grayInactive,
  grayDisabled,
  grayInactiveFilled,
  border1,
  border2,
  border3,
  border4,
  bgPrimary,
  bgSecondary,
  pinkPrimary,
  pinkInactive,
  pinkDisabled,
  green200,
  blogPrimary,
  customGray,
  grayMain,
};
