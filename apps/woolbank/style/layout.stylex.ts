import * as stylex from '@stylexjs/stylex';

/**
 * 레이아웃 상수 (컴파일 타임 defineConsts).
 * stylex.create 안에서는 일반 모듈 import 값을 쓸 수 없어 defineConsts 로 제공한다.
 * 값은 style/layout.ts 와 동기 유지.
 */
export const layoutConsts = stylex.defineConsts({
  headerHeight: '4.8rem',
});
