import '@emotion/react';
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

type ColorType =
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

declare module '@emotion/react' {
  export interface Theme {
    [key in ['dark' | 'white']]: {
      colors: Record<ColorType, string>;
    };
  }
}
