import { defineConfig } from 'vitest/config';
import { viteStylexPlugin } from './tools/stylex/viteStylexPlugin.mjs';
import { workspaceAlias } from './tools/workspaceAlias.mjs';

type ProjectOptions = {
  /** 실행 결과에 표시되는 프로젝트 이름 */
  name: string;
  /** 프로젝트 루트 (각 vitest.config.mts 의 `import.meta.dirname`) */
  root: string;
  environment?: 'jsdom' | 'node';
};

/**
 * 모든 프로젝트가 공유하는 vitest 설정. 각 패키지의 vitest.config.mts 에서 호출한다.
 * lodash-es 같은 ESM 전용 의존성은 Vite 가 그대로 로드하므로 별도 변환 예외가 필요 없다.
 */
export function createProjectConfig({ name, root, environment = 'jsdom' }: ProjectOptions) {
  return defineConfig({
    root,
    plugins: [viteStylexPlugin()],
    resolve: { alias: workspaceAlias },
    // 앱 tsconfig 의 `jsx: preserve` 를 그대로 따르지 않도록 명시한다
    oxc: { jsx: { runtime: 'automatic' } },
    test: {
      name,
      globals: true,
      environment,
    },
  });
}
