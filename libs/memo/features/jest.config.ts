export default {
  displayName: 'memo-features',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@swc/jest',
    '^.+\\.[tj]sx?$': require('../../../tools/stylex/jestStylexTransform'),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/memo/features',
};
