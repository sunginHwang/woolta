//@ts-check
const path = require('path');

/**
 * 공용 Jest transform 엔트리 — StyleX 컴파일(@stylexswc/jest) 후 TS/JSX 컴파일(@swc/jest) 체인.
 * 각 프로젝트 jest.config.ts 의 transform 에서 require 해 사용한다.
 */
module.exports = [
  'jest-chain-transform',
  {
    transformers: [
      [
        '@stylexswc/jest',
        {
          rsOptions: {
            dev: true,
            unstable_moduleResolution: { type: 'commonJS' },
            aliases: {
              '@wds/*': [path.join(__dirname, '../../libs/wds/src/lib/style/*')],
            },
            // rs-compiler 가 .ts 를 TSX 로 파싱해 제네릭 화살표 함수와 충돌 — 스타일 파일로 한정
            include: [/\.stylex\.(ts|js)$/, /\.tsx$/],
          },
        },
      ],
      [
        '@swc/jest',
        { jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } } },
      ],
    ],
  },
];
