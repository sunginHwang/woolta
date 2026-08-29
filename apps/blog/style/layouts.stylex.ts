import * as stylex from '@stylexjs/stylex';

/**
 * blog 레이아웃 상수 (컴파일 타임 defineConsts).
 * stylex.create 안에서는 일반 모듈 import 값을 쓸 수 없어 defineConsts 로 제공한다.
 * 런타임 값이 필요한 곳은 기존 style/layouts.ts 를 계속 사용한다 — 값 동기 유지.
 */
export const layoutConsts = stylex.defineConsts({
  mainHeaderHeight: '6rem',
  mobileHeader: '4.8rem',
  headerHeight: '4.8rem',
  mainFooterHeight: '8rem',
  mainRightWidth: '24rem',
  contentMaxWidth: '1200px',
  mobileWidth: '1024px',
  phoneWidth: '450px',
});
