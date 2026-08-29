//@ts-check
const path = require('path');
const rsOptions = require('./stylexRsOptions');

const monorepoRoot = path.join(__dirname, '../..');

/**
 * 앱별 postcss.config.js 팩토리. `@stylex;` 지시자가 있는 CSS 파일에
 * include 대상 파일들에서 추출한 StyleX CSS를 주입한다.
 *
 * @param {string} appRoot - 앱 루트 (postcss.config.js의 __dirname)
 * @param {string[]} appDirs - 스캔할 앱 하위 디렉터리 (예: ['app', 'components'])
 */
function createPostcssConfig(appRoot, appDirs) {
  const include = [
    ...appDirs.map((dir) => path.join(appRoot, dir, '**/*.{js,jsx,ts,tsx}')),
    // transpilePackages로 소스 참조되는 모노레포 라이브러리들
    path.join(monorepoRoot, 'libs/**/src/**/*.{js,jsx,ts,tsx}'),
    '!' + path.join(monorepoRoot, '**/node_modules/**'),
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
