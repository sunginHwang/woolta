export type SemanticColorTokens = {
  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textInverse: string;
  textActive: string;
  textInactive: string;

  // Background / Surface
  bgPage: string;
  bgSurface: string;
  bgSurfaceSecondary: string;
  bgOverlay: string;
  bgInverse: string;

  // Border
  borderDefault: string;
  borderSubtle: string;
  borderStrong: string;
  borderFaint: string;

  // Interactive
  interactivePrimary: string;
  interactivePrimaryHover: string;
  interactivePrimaryDisabled: string;

  // Brand
  brandPrimary: string;
  brandLight: string;
  brandDisabled: string;

  // Status
  statusSuccess: string;
  statusWarning: string;
  statusError: string;
  statusInfo: string;
};

export type LegacyColorKey =
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

export type ColorType = LegacyColorKey | keyof SemanticColorTokens;

export type ThemeType = 'dark' | 'light';
