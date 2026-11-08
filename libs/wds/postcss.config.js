//@ts-check
const path = require('path');

/**
 * wds 스토리북용 postcss 설정.
 * `.storybook/stylex.css` 의 `@stylex;` 지시자를 wds 소스에서 추출한 StyleX CSS 로 치환한다.
 *
 * rsOptions 는 tools/stylex/viteStylexPlugin.mts(스토리 번들 변환)와 반드시 같아야 한다 —
 * 두 쪽의 클래스명이 어긋나면 CSS 는 있는데 아무 스타일도 적용되지 않는다.
 * (앱은 Turbopack 로더와 tools/stylex/stylexRsOptions.js 를 공유하는 것과 같은 이유)
 */
const monorepoRoot = path.join(__dirname, '../..');

const rsOptions = {
  dev: true,
  runtimeInjection: false,
  aliases: {
    '@wds/*': [path.join(monorepoRoot, 'libs/wds/src/lib/style/*')],
  },
  unstable_moduleResolution: { type: 'commonJS' },
};

module.exports = {
  plugins: {
    '@stylexswc/postcss-plugin': {
      include: [
        path.join(__dirname, 'src/**/*.{ts,tsx}'),
        // Portal·Suspense 가 쓰는 @common 의 StyleX 도 함께 추출한다
        path.join(monorepoRoot, 'libs/common/src/**/*.{ts,tsx}'),
        `!${path.join(monorepoRoot, '**/node_modules/**')}`,
        `!${path.join(__dirname, '**/*.{test,spec}.*')}`,
      ],
      useCSSLayers: true,
      rsOptions,
    },
  },
};
