/* eslint-disable */
export default {
  displayName: 'woolbank',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@swc/jest',
    '^.+\\.[tj]sx?$': require('../../tools/stylex/jestStylexTransform'),
  },
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/woolbank',
};
