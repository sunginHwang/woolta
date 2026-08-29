export default {
  displayName: 'todo-features',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@swc/jest',
    '^.+\\.[tj]sx?$': [
      'jest-chain-transform',
      {
        transformers: [
          [
            '@stylexswc/jest',
            {
              rsOptions: {
                dev: true,
                unstable_moduleResolution: { type: 'commonJS' },
                // rs-compiler 가 .ts 를 TSX 로 파싱해 제네릭 화살표 함수와 충돌 — 스타일 파일로 한정
                include: [/\.stylex\.(ts|js)$/, /\.tsx$/],
              },
            },
          ],
          ['@swc/jest', { jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } } }],
        ],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/todo/features',
};
