/* eslint-disable */
export default {
  displayName: 'wds',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': require('../../tools/stylex/jestStylexTransform'),
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/wds',
};
