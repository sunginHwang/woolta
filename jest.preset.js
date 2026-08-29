const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@article-curations/features$': path.resolve(__dirname, 'libs/article-curations/features/src/index.ts'),
    '^@article-curations/screens$': path.resolve(__dirname, 'libs/article-curations/screens/src/index.ts'),
    '^@common/server$': path.resolve(__dirname, 'libs/common/src/server.ts'),
    '^@common/test$': path.resolve(__dirname, 'libs/common/test/src/index.ts'),
    '^@common$': path.resolve(__dirname, 'libs/common/src/index.ts'),
    '^@wds/(.*)$': path.resolve(__dirname, 'libs/wds/src/lib/style/$1'),
    '^@wds$': path.resolve(__dirname, 'libs/wds/src/index.ts'),
    '^@blog/features$': path.resolve(__dirname, 'libs/blog/features/src/index.ts'),
    '^@memo/features$': path.resolve(__dirname, 'libs/memo/features/src/index.ts'),
    '^@memo/screens$': path.resolve(__dirname, 'libs/memo/screens/src/index.ts'),
    '^@todo/features$': path.resolve(__dirname, 'libs/todo/features/src/index.ts'),
    '^@todo/screens$': path.resolve(__dirname, 'libs/todo/screens/src/index.ts'),
    '^@blog/screens$': path.resolve(__dirname, 'libs/blog/screens/src/index.ts'),
    '^@woolbank/features$': path.resolve(__dirname, 'libs/woolbank/features/src/index.ts'),
    '^@woolbank/screens$': path.resolve(__dirname, 'libs/woolbank/screens/src/index.ts'),
  },
};
