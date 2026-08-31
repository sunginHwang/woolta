//@ts-check
const path = require('path');
const rsOptions = require('./stylexRsOptions');

const monorepoRoot = path.join(__dirname, '../..');

/**
 * 앱별 postcss.config.js 팩토리. `@stylex;` 지시자가 있는 CSS 파일에
 * include 대상 파일들에서 추출한 StyleX CSS를 주입한다.
 *
 * 스캔 범위는 앱 루트 전체다. 예전에는 디렉터리를 열거했는데(['app','components']),
 * 목록에 없는 디렉터리의 stylex 파일이 조용히 빠졌다 — `style/*.stylex.ts` 의
 * defineConsts 가 추출되지 않아 `width: var(--x…)` 가 미정의 변수로 남고
 * 레이아웃이 무너졌다. 열거 대신 산출물만 제외한다.
 *
 * @param {string} appRoot - 앱 루트 (postcss.config.js의 __dirname)
 */
function createPostcssConfig(appRoot) {
  const include = [
    path.join(appRoot, '**/*.{js,jsx,ts,tsx}'),
    // transpilePackages로 소스 참조되는 모노레포 라이브러리들
    path.join(monorepoRoot, 'libs/**/src/**/*.{js,jsx,ts,tsx}'),
    `!${path.join(monorepoRoot, '**/node_modules/**')}`,
    `!${path.join(appRoot, '.next/**')}`,
    `!${path.join(appRoot, '.storybook/**')}`,
    `!${path.join(appRoot, '**/*.stories.*')}`,
    `!${path.join(appRoot, '**/*.{test,spec}.*')}`,
  ];

  return {
    plugins: {
      '@stylexswc/postcss-plugin': {
        include,
        useCSSLayers: true,
        rsOptions,
      },
      autoprefixer: {},
    },
  };
}

module.exports = createPostcssConfig;
