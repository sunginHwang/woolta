//@ts-check
const stylexPluginModule = require('@stylexswc/nextjs-plugin');
// CJS/ESM interop — 런타임은 모듈 자체가 함수지만 타입 선언은 default export
const stylexPlugin = stylexPluginModule.default ?? stylexPluginModule;

/**
 * 모노레포 공통 StyleX(SWC) Next.js 플러그인 설정.
 * 각 앱 next.config.js에서 `module.exports = withStylex(nextConfig)` 로 사용한다.
 *
 * - SWC 기반(rs-compiler)이라 babel 없이 동작 — compiler.styledComponents와 공존 가능
 * - 각 앱 layout.tsx에서 `import '@stylexswc/webpack-plugin/stylex.css'` (캐리어 CSS) 필요
 */
const withStylex = stylexPlugin({
  rsOptions: {
    dev: process.env.NODE_ENV === 'development',
    runtimeInjection: false,
    treeshakeCompensation: true,
    styleResolution: 'application-order',
    enableDebugClassNames: process.env.NODE_ENV === 'development',
    unstable_moduleResolution: {
      type: 'commonJS',
    },
  },
});

module.exports = withStylex;
