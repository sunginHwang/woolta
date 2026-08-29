import * as stylex from '@stylexjs/stylex';

/**
 * 타이포그래피 스케일. 모든 컴포넌트가 이 객체를 사용한다.
 */
export const typographyStyles = stylex.create({
  title1Bold: { fontSize: '24px', lineHeight: '31.2px', fontWeight: 600 },
  title1Medium: { fontSize: '24px', lineHeight: '31.2px', fontWeight: 500 },
  title2Bold: { fontSize: '20px', lineHeight: '26px', fontWeight: 600 },
  title2Medium: { fontSize: '20px', lineHeight: '26px', fontWeight: 500 },
  title3Bold: { fontSize: '18px', lineHeight: '25.2px', fontWeight: 600 },
  title3Medium: { fontSize: '18px', lineHeight: '25.2px', fontWeight: 500 },
  title4Bold: { fontSize: '16px', lineHeight: '22.4px', fontWeight: 600 },
  title4Medium: { fontSize: '16px', lineHeight: '22.4px', fontWeight: 500 },
  title5Bold: { fontSize: '15px', lineHeight: '21px', fontWeight: 600 },
  title5Medium: { fontSize: '15px', lineHeight: '21px', fontWeight: 500 },
  title6Bold: { fontSize: '14px', lineHeight: '19.6px', fontWeight: 600 },
  title6Medium: { fontSize: '14px', lineHeight: '19.6px', fontWeight: 500 },
  body1: { fontSize: '16px', lineHeight: '22.4px', fontWeight: 400 },
  body2: { fontSize: '15px', lineHeight: '21px', fontWeight: 400 },
  body3: { fontSize: '14px', lineHeight: '19.6px', fontWeight: 400 },
  body4Bold: { fontSize: '13px', lineHeight: '18.2px', fontWeight: 600 },
  body4Medium: { fontSize: '13px', lineHeight: '18.2px', fontWeight: 500 },
  body4Regular: { fontSize: '13px', lineHeight: '18.2px', fontWeight: 400 },
  small1Bold: { fontSize: '12px', lineHeight: '16.8px', fontWeight: 600 },
  small1Medium: { fontSize: '12px', lineHeight: '16.8px', fontWeight: 500 },
  small1Regular: { fontSize: '12px', lineHeight: '16.8px', fontWeight: 400 },
  small2Bold: { fontSize: '11px', lineHeight: '15.4px', fontWeight: 600 },
  small2Medium: { fontSize: '11px', lineHeight: '15.4px', fontWeight: 500 },
  small2Regular: { fontSize: '11px', lineHeight: '15.4px', fontWeight: 400 },
  small3Bold: { fontSize: '10px', lineHeight: '14px', fontWeight: 600 },
  small3Medium: { fontSize: '10px', lineHeight: '14px', fontWeight: 500 },
  small3Regular: { fontSize: '10px', lineHeight: '14px', fontWeight: 400 },
  small4Bold: { fontSize: '9px', lineHeight: '12.6px', fontWeight: 600 },
  small4Medium: { fontSize: '9px', lineHeight: '12.6px', fontWeight: 500 },
  small4Regular: { fontSize: '9px', lineHeight: '12.6px', fontWeight: 400 },
});

/** typographyStyles 의 키 — 컴포넌트 variant prop 타입으로 쓴다 */
export type FontVarient = keyof typeof typographyStyles;
