import { css, CSSProp } from 'styled-components';

export type FontVarient =
  | 'title1Bold'
  | 'title1Medium'
  | 'title2Bold'
  | 'title2Medium'
  | 'title3Bold'
  | 'title3Medium'
  | 'title4Bold'
  | 'title4Medium'
  | 'title5Bold'
  | 'title5Medium'
  | 'title6Bold'
  | 'title6Medium'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4Bold'
  | 'body4Medium'
  | 'body4Regular'
  | 'small1Bold'
  | 'small1Medium'
  | 'small1Regular'
  | 'small2Bold'
  | 'small2Medium'
  | 'small2Regular'
  | 'small3Bold'
  | 'small3Medium'
  | 'small3Regular'
  | 'small4Bold'
  | 'small4Medium'
  | 'small4Regular';

export const typography: Record<FontVarient, CSSProp> = {
  title1Bold: css`
    font-size: 24px;
    line-height: 31.2px;
    font-weight: 600;
  `,
  title1Medium: css`
    font-size: 24px;
    line-height: 31.2px;
    font-weight: 500;
  `,
  title2Bold: css`
    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
  `,
  title2Medium: css`
    font-size: 20px;
    line-height: 26px;
    font-weight: 500;
  `,
  title3Bold: css`
    font-size: 18px;
    line-height: 25.2px;
    font-weight: 600;
  `,
  title3Medium: css`
    font-size: 18px;
    line-height: 25.2px;
    font-weight: 500;
  `,
  title4Bold: css`
    font-size: 16px;
    line-height: 22.4px;
    font-weight: 600;
  `,
  title4Medium: css`
    font-size: 16px;
    line-height: 22.4px;
    font-weight: 500;
  `,
  title5Bold: css`
    font-size: 15px;
    line-height: 21px;
    font-weight: 600;
  `,
  title5Medium: css`
    font-size: 15px;
    line-height: 21px;
    font-weight: 500;
  `,
  title6Bold: css`
    font-size: 14px;
    line-height: 19.6px;
    font-weight: 600;
  `,
  title6Medium: css`
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
  body4Bold: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 600;
  `,
  body4Medium: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 500;
  `,
  body4Regular: css`
    font-size: 13px;
    line-height: 18.2px;
    font-weight: 400;
  `,
  small1Bold: css`
    font-size: 12px;
    line-height: 16.8px;
    font-weight: 600;
  `,
  small1Medium: css`
    font-size: 12px;
    line-height: 16.8px;
    font-weight: 500;
  `,
  small1Regular: css`
    font-size: 12px;
    line-height: 16.8px;
    font-weight: 400;
  `,
  small2Bold: css`
    font-size: 11px;
    line-height: 15.4px;
    font-weight: 600;
  `,
  small2Medium: css`
    font-size: 11px;
    line-height: 15.4px;
    font-weight: 500;
  `,
  small2Regular: css`
    font-size: 11px;
    line-height: 15.4px;
    font-weight: 400;
  `,
  small3Bold: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 600;
  `,
  small3Medium: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 500;
  `,
  small3Regular: css`
    font-size: 10px;
    line-height: 14px;
    font-weight: 400;
  `,
  small4Bold: css`
    font-weight: 600;
    font-size: 9px;
    line-height: 12.6px;
  `,
  small4Medium: css`
    font-weight: 500;
    font-size: 9px;
    line-height: 12.6px;
  `,
  small4Regular: css`
    font-weight: 400;
    font-size: 9px;
    line-height: 12.6px;
  `,
};
