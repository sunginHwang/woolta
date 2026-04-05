export type FontVariant =
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

export interface TypographyValue {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600';
}
