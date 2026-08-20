const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@common/server$': path.resolve(__dirname, 'libs/common/src/server.ts'),
    '^@common/test$': path.resolve(__dirname, 'libs/common/test/src/index.ts'),
    '^@common$': path.resolve(__dirname, 'libs/common/src/index.ts'),
    '^@wds$': path.resolve(__dirname, 'libs/wds/src/index.ts'),
    '^@blog/features$': path.resolve(__dirname, 'libs/blog/features/src/index.ts'),
    '^@blog/screens$': path.resolve(__dirname, 'libs/blog/screens/src/index.ts'),
    '^@woolbank/features$': path.resolve(__dirname, 'libs/woolbank/features/src/index.ts'),
    '^@woolbank/screens$': path.resolve(__dirname, 'libs/woolbank/screens/src/index.ts'),
  },
};
