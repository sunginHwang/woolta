/* eslint-disable */
export default {
  displayName: 'woolta',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@swc/jest',
    '^.+\\.[tj]sx?$': require('../../tools/stylex/jestStylexTransform'),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/woolta',
};
