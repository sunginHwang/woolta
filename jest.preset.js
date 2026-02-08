const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@common/server$': path.resolve(__dirname, 'libs/common/src/server.ts'),
    '^@common/test$': path.resolve(__dirname, 'libs/common/test/src/index.ts'),
    '^@common$': path.resolve(__dirname, 'libs/common/src/index.ts'),
    '^@wds$': path.resolve(__dirname, 'libs/wds/src/index.ts'),
  },
};
