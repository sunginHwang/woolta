
import { css, SerializedStyles } from '@emotion/react';

export type FontVarient =
  // -start- depreacard-대상
  | 'title1'
  | 'title2'
  | 'title3'
  | 'title4'
  | 'title5'
  | 'title7'
  | 'small1'
  | 'small2'
  | 'small4'
  | 'small4_semibold'
  | 'small5'
  | 'button'
  | 'button_small'
  // -end- depreacard-
  | 'title1_bold'
  | 'title1_medium'
  | 'title2_bold'
  | 'title2_medium'
  | 'title3_bold'
  | 'title3_medium'
  | 'title4_bold'
  | 'title4_medium'
  | 'title5_bold'
  | 'title5_medium'
  | 'title6_bold'
  | 'title6_medium'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4_bold'
  | 'body4_medium'
  | 'body4_regular'
  | 'small1_bold'
  | 'small1_medium'
  | 'small1_regular'
  | 'small2_bold'
  | 'small2_medium'
  | 'small2_regular'
  | 'small3_bold'
  | 'small3_medium'
  | 'small3_regular'
  | 'small4_bold'
  | 'small4_medium'
  | 'small4_regular';

export const typography: Record<FontVarient, SerializedStyles> = {
  // title1_bold 대체
  title1: css`
    font-size: 24px;
    line-height: 31.2px;
    font-weight: 600;
  `,
  // title2_bold 대체
  title2: css`
    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
  `,
  // title3_bold 대체
  title3: css`
    font-size: 18px;
    line-height: 25.2px;
    font-weight: 600;
  `,
  // title4_bold 대체
  title4: css`
    font-size: 16px;
    line-height: 22.4px;
    font-weight: 600;
  `,
  // title4_medium 대체
  title5: css`
    font-size: 16px;
    line-height: 22.4px;
    font-weight: 500;
  `,
  // body3_medium 대체
  title7: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 500;
  `,
  // body4_medium 대체
  small1: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 500;
  `,
  // small1_medium 대체
  small2: css`
    font-size: 12px;
    line-height: 16.8px;
    font-weight: 500;
  `,
  // title5_medium 대체
  button: css`
    font-size: 16px;
    line-height: 21px;
    font-weight: 500;
  `,
  // body4_medium 대체
  button_small: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 500;
  `,
  // small3_regular 대체
  small4: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 400;
  `,
  // small3_bold 대체
  small4_semibold: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
  `,
  // small4_medium 대체
  small5: css`
    font-weight: 500;
    font-size: 9px;
    line-height: 12.6px;
  `,
  title1_bold: css`
    font-size: 24px;
    line-height: 31.2px;
    font-weight: 600;
  `,
  title1_medium: css`
    font-size: 24px;
    line-height: 31.2px;
    font-weight: 500;
  `,
  title2_bold: css`
    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
  `,
  title2_medium: css`
    font-size: 20px;
    line-height: 26px;
    font-weight: 500;
  `,
  title3_bold: css`
    font-size: 18px;
    line-height: 25.2px;
    font-weight: 600;
  `,
  title3_medium: css`
    font-size: 18px;
    line-height: 25.2px;
    font-weight: 500;
  `,
  title4_bold: css`
    font-size: 16px;
    line-height: 22.4px;
    font-weight: 600;
  `,
  title4_medium: css`
    font-size: 16px;
    line-height: 22.4px;
    font-weight: 500;
  `,
  title5_bold: css`
    font-size: 15px;
    line-height: 21px;
    font-weight: 600;
  `,
  title5_medium: css`
    font-size: 15px;
    line-height: 21px;
    font-weight: 500;
  `,
  title6_bold: css`
    font-size: 14px;
    line-height: 19.6px;
    font-weight: 600;
  `,
  title6_medium: css`
  font-size: 14px;
  line-height: 19.6px;
  font-weight: 500;
`,
  body1: css`
    font-size: 16px;
    line-height: 22.4px;
    font-weight: 400;
  `,
  body2: css`
    font-size: 15px;
    line-height: 21px;
    font-weight: 400;
  `,
  body3: css`
    font-size: 14px;
    line-height: 19.6px;
    font-weight: 400;
  `,
  body4_bold: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 600;
  `,
  body4_medium: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 500;
  `,
  body4_regular: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 400;
  `,
  small1_bold: css`
    font-size: 12px;
    line-height: 16.8px;
    font-weight: 600;
  `,
  small1_medium: css`
    font-size: 12px;
    line-height: 16.8px;
    font-weight: 500;
  `,
  small1_regular: css`
    font-size: 12px;
    line-height: 16.8px;
    font-weight: 400;
  `,
  small2_bold: css`
    font-size: 11px;
    line-height: 15.4px;
    font-weight: 600;
  `,
  small2_medium: css`
    font-size: 11px;
    line-height: 15.4px;
    font-weight: 500;
  `,
  small2_regular: css`
    font-size: 11px;
    line-height: 15.4px;
    font-weight: 400;
  `,
  small3_bold: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
  `,
  small3_medium: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 500;
  `,
  small3_regular: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 400;
  `,
  small4_bold: css`
    font-weight: 600;
    font-size: 9px;
    line-height: 12.6px;
  `,
  small4_medium: css`
    font-weight: 500;
    font-size: 9px;
    line-height: 12.6px;
  `,
  small4_regular: css`
    font-weight: 400;
    font-size: 9px;
    line-height: 12.6px;
  `,
};
