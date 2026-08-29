import * as stylex from '@stylexjs/stylex';

/**
 * 앱 셸 레이아웃 상수 (컴파일 타임 defineConsts).
 * stylex.create 안에서는 일반 모듈 import 값을 쓸 수 없어 defineConsts 로 제공한다.
 * 런타임 값이 필요한 곳(레이아웃 계산 등)은 기존 style/layouts.ts 를 계속 사용한다 — 값 동기 유지.
 */
export const layoutConsts = stylex.defineConsts({
  railWidth: '5.6rem',
  railExpandedWidth: '16.8rem',
  railItemSize: '4rem',
  subSidebarWidth: '22rem',
});
