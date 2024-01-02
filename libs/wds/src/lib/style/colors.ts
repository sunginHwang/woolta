import { Theme } from '@emotion/react';
import { zIndex } from './zIndex';

export const brandColor = '#E62F71';

export const white = '#FFFFFF';
export const black = '#000000';

export const gray050 = '#FBFBFB';
export const gray100 = '#F4F4F4';
export const gray150 = '#F0F0F0';
export const gray200 = '#E9E9E9';
export const gray300 = '#E1E1E1';
export const gray400 = '#D3D3D3';
export const gray500 = '#B5B5B5';
export const gray600 = '#919191';
export const gray650 = '#5E666E';
export const gray700 = '#6D6D6D';
export const gray800 = '#484848';
export const gray900 = '#242424';
export const gray950 = '#121212';
export const gray1000 = '#3A3E46';

export const pink030 = '#FFF7FA';
export const pink050 = '#FFEDF3';
export const pink100 = '#FFDEEA';
export const pink150 = '#FFCBDE';
export const pink200 = '#FFB8D2';
export const pink300 = '#FF92BA';
export const pink400 = '#FF6AA0';
export const pink500 = '#FF347D';
export const pink600 = '#E62F71';
export const pink700 = '#CF2A66';
export const pink800 = '#A72253';
export const pink900 = '#871C43';

export const blue050 = '#F2F4FF';
export const blue100 = '#E1E5FF';
export const blue150 = '#C7D0FF';
export const blue200 = '#B2BDFF';
export const blue300 = '#8C9EFF';
export const blue400 = '#536DFE';
export const blue500 = '#536DFE';
export const blue550 = '#4864FF';
export const blue600 = '#445CD1';
export const blue700 = '#384BA4';
export const blue800 = '#2D3A7A';
export const blue900 = '#232A52';

export const red050 = '#fff5f6';
export const red100 = '#ffebed';
export const red150 = '#ffdbdf';
export const red200 = '#ffc7cd';
export const red300 = '#ffa8b2';
export const red400 = '#ff6a7c';
export const red500 = '#f03e3e';
export const red600 = '#c2393b';
export const red700 = '#953436';
export const red800 = '#692d2e';

export const green200 = '#6E827F';

export const yellow500 = '#FEE700';

export const orange500 = '#FFA93B';
export const orange600 = '#f25e5e';

export const safeGreen = '#5ac366';
export const warningRed = '#f03e3e';
export const lightYellow = '#fff97a';
export const periwinkleBlue = '#8c9eff';
export const kakaoColor = '#fded4f';
export const yellowReview = '#FEC600';

export const grayMain = 'rgba(255, 255, 255, 0.88)';
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

export type ColorType =
  | 'white'
  | 'black'
  | 'gray050'
  | 'gray100'
  | 'gray150'
  | 'gray200'
  | 'gray300'
  | 'gray400'
  | 'gray500'
  | 'gray600'
  | 'gray650'
  | 'gray700'
  | 'gray800'
  | 'gray900'
  | 'gray950'
  | 'pink030'
  | 'pink050'
  | 'pink100'
  | 'pink150'
  | 'pink200'
  | 'pink300'
  | 'pink400'
  | 'pink500'
  | 'pink600'
  | 'pink700'
  | 'pink800'
  | 'pink900'
  | 'blue050'
  | 'blue100'
  | 'blue150'
  | 'blue200'
  | 'blue300'
  | 'blue400'
  | 'blue500'
  | 'blue550'
  | 'blue600'
  | 'blue700'
  | 'blue800'
  | 'blue900'
  | 'red050'
  | 'red100'
  | 'red150'
  | 'red500'
  | 'yellow500'
  | 'orange500'
  | 'orange600'
  | 'orangePrimary'
  | 'yellow'
  | 'grayPrimary'
  | 'graySecondary'
  | 'grayTertiary'
  | 'grayActive'
  | 'grayInactive'
  | 'grayInactiveFilled'
  | 'grayDisabled'
  | 'border1'
  | 'border2'
  | 'border3'
  | 'border4'
  | 'bgPrimary'
  | 'bgSecondary'
  | 'green200'
  | 'pinkPrimary'
  | 'pinkInactive'
  | 'pinkDisabled'
  | 'blogPrimary'
  | 'customGray'
  | 'grayMain';

export const colors: Record<ColorType, string> = {
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

export type ThemeType = 'dark' | 'light';

export const theme: {
  [key in ThemeType]: Theme;
} = {
  light: {
    zIndex,
    colors: {
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
    },
  },
  dark: {
    zIndex,
    colors: {
      white: '#000',
      black: '#fff',
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
    },
  },
};

declare module '@emotion/react' {
  export interface Theme {
    colors: Record<ColorType, string>;
    zIndex: typeof zIndex;
  }
}
