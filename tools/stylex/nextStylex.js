//@ts-check
const stylexPluginModule = require('@stylexswc/nextjs-plugin/turbopack');
// CJS/ESM interop — 런타임은 모듈 자체가 함수지만 타입 선언은 default export
const stylexPlugin = stylexPluginModule.default ?? stylexPluginModule;
const rsOptions = require('./stylexRsOptions');

/**
 * 모노레포 공통 StyleX(SWC) Next.js 플러그인 설정 (Turbopack).
 * 각 앱 next.config.js에서 `module.exports = withStylex(nextConfig)` 로 사용한다.
 *
 * - 변환은 @stylexswc/turbopack-plugin 로더가, CSS 추출은 각 앱의
 *   postcss.config.js(@stylexswc/postcss-plugin)가 담당한다 — rsOptions 공유 필수
 * - 각 앱 layout.tsx에서 `@stylex;` 지시자를 담은 CSS(import './stylex.css') 필요
 * - 주의: 이 래퍼는 turbopack.rules를 통째로 재정의하므로 앱별 추가 rules(SVGR 등)는
 *   withStylex(nextConfig) 결과에 사후 병합한다
 */
const withStylex = stylexPlugin({ rsOptions });

module.exports = withStylex;
