import path from 'node:path';
import type { Alias } from 'vite';
import { workspaceRoot } from './workspaceRoot.mjs';

const toRoot = (relativePath: string) => path.resolve(workspaceRoot, relativePath);

/**
 * tsconfig.base.json 의 paths 를 Vite alias 로 옮긴 것 — Vitest 와 Storybook 이 공유한다.
 * tsconfig.base.json 과 어긋나면 타입은 통과하는데 번들만 깨지므로 함께 수정한다.
 */
export const workspaceAlias: Alias[] = [
  { find: /^@article-curations\/features$/, replacement: toRoot('libs/article-curations/features/src/index.ts') },
  { find: /^@article-curations\/screens$/, replacement: toRoot('libs/article-curations/screens/src/index.ts') },
  { find: /^@blog\/features$/, replacement: toRoot('libs/blog/features/src/index.ts') },
  { find: /^@blog\/screens$/, replacement: toRoot('libs/blog/screens/src/index.ts') },
  { find: /^@common\/server$/, replacement: toRoot('libs/common/src/server.ts') },
  { find: /^@common\/test$/, replacement: toRoot('libs/common/test/src/index.ts') },
  { find: /^@common$/, replacement: toRoot('libs/common/src/index.ts') },
  { find: /^@memo\/features$/, replacement: toRoot('libs/memo/features/src/index.ts') },
  { find: /^@memo\/screens$/, replacement: toRoot('libs/memo/screens/src/index.ts') },
  { find: /^@todo\/features$/, replacement: toRoot('libs/todo/features/src/index.ts') },
  { find: /^@todo\/screens$/, replacement: toRoot('libs/todo/screens/src/index.ts') },
  { find: /^@wds\/(.*)$/, replacement: toRoot('libs/wds/src/lib/style/$1') },
  { find: /^@wds$/, replacement: toRoot('libs/wds/src/index.ts') },
  { find: /^@woolbank\/features$/, replacement: toRoot('libs/woolbank/features/src/index.ts') },
  { find: /^@woolbank\/screens$/, replacement: toRoot('libs/woolbank/screens/src/index.ts') },
];
