// import { keyframes } from 'styled-components';

// export default {
//   colors: {
//     mainThemeColor: '#6e827f',
//     whiteColor: '#fff',
//     customGrayColor: 'rgba(23, 42, 58, .1)',
//     sideFontGrayColor: '#c2cab9',
//     titleFontColor: '#6e827f',
//     customBlackColor: '#585858',
//     bottomLineColor: '#f2f5ee',
//     SideBarSpaceColor: 'rgba(0,0,0,.3)',
//     greyL1: '#9ba5a0',
//     greyL2: '#eee',
//     greyL3: '#ebebeb',
//     greyL4: '#e8e8e8',
//     greyL5: '#666',
//     greyD1: '#383838',
//     greyD2: '#868e96',
//     cyanL1: '#56b6c2',
//     whiteL1: '#c6cbd1',
//     whiteL2: '#dfe2e5',
//     whiteL3: '#f6f8fa',
//     textColor: '#6e827f',
//     markdownCodeColor: '#6e827f',
//     imgOpacity: '1',
//     headerColor: '#fff',
//     contentColor: '#6e827f',
//     loadingAnimationColor1: 'hsl(0,0%,89%)',
//     loadingAnimationColor2: 'hsl(0,0%,85%)',
//     loadingAnimationColor3: 'hsl(0,0%,89%)',
//   },
// };

export const brand_color = '#E62F71';

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

export const safe_green = '#5ac366';
export const warning_red = '#f03e3e';
export const light_yellow = '#fff97a';
export const periwinkle_blue = '#8c9eff';
export const kakao_color = '#fded4f';
export const yellow_review = '#FEC600';

export const gray_primary = black;
export const gray_secondary = gray700;
export const gray_tertiary = gray500;
export const gray_active = gray900;
export const gray_inactive = gray600;
export const gray_disabled = gray300;
export const gray_inactive_filled = gray300;

export const border1 = gray400;
export const border2 = gray300;
export const border3 = gray200;
export const border4 = gray100;

export const bg_primary = gray050;
export const bg_secondary = gray100;

export const pink_primary = pink600;
export const pink_inactive = pink200;
export const pink_disabled = pink150;

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
  | 'yellow'
  | 'gray_primary'
  | 'gray_secondary'
  | 'gray_tertiary'
  | 'gray_active'
  | 'gray_inactive'
  | 'gray_inactive_filled'
  | 'gray_disabled'
  | 'border1'
  | 'border2'
  | 'border3'
  | 'border4'
  | 'bg_primary'
  | 'bg_secondary'
  | 'green200'
  | 'pink_primary'
  | 'pink_inactive'
  | 'pink_disabled';

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
  yellow: yellow_review,
  yellow500,
  gray_primary,
  gray_secondary,
  gray_tertiary,
  gray_active,
  gray_inactive,
  gray_disabled,
  gray_inactive_filled,
  border1,
  border2,
  border3,
  border4,
  bg_primary,
  bg_secondary,
  pink_primary,
  pink_inactive,
  pink_disabled,
  green200,
};
