//@ts-check
const path = require('path');

/**
 * StyleX rs-compiler 공통 옵션.
 * next.config의 Turbopack 로더와 postcss 추출 플러그인이 동일한 옵션을 공유해야
 * 양쪽에서 생성되는 클래스명이 일치한다.
 *
 * 타입 주석이 없으면 styleResolution 등이 리터럴이 아닌 string 으로 추론돼
 * 플러그인의 StyleXOptions 에 대입되지 않는다.
 *
 * @type {NonNullable<import('@stylexswc/webpack-plugin').StyleXPluginOption['rsOptions']>}
 */
const rsOptions = {
  dev: process.env.NODE_ENV === 'development',
  runtimeInjection: false,
  treeshakeCompensation: true,
  styleResolution: 'application-order',
  enableDebugClassNames: process.env.NODE_ENV === 'development',
  // '@wds/tokens.stylex' 등 토큰 파일 직접 import 를 컴파일러가 해석할 수 있게 한다 (tsconfig paths 와 동기)
  aliases: {
    '@wds/*': [path.join(__dirname, '../../libs/wds/src/lib/style/*')],
  },
  unstable_moduleResolution: {
    type: 'commonJS',
  },
};

module.exports = rsOptions;
