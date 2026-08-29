import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * `pnpm-workspace.yaml` 을 위로 훑어 모노레포 루트를 찾는다.
 *
 * `import.meta.dirname` / `__dirname` 을 쓰지 않는 이유: 이 파일을 읽는 로더가
 * Vite 설정 번들러(ESM), Storybook 설정 로더(CJS 로 트랜스파일될 수 있음) 로 제각각이라
 * 어느 한쪽에서만 정의되는 값에 기대면 로더가 바뀔 때 조용히 깨진다.
 */
export function findWorkspaceRoot(startDir: string = process.cwd()): string {
  let current = path.resolve(startDir);

  while (true) {
    if (existsSync(path.join(current, 'pnpm-workspace.yaml'))) return current;

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`pnpm-workspace.yaml 을 찾지 못했습니다 (탐색 시작: ${startDir})`);
    }
    current = parent;
  }
}

export const workspaceRoot = findWorkspaceRoot();
