import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const monorepoRoot = import.meta.dirname;

/**
 * 스토리를 실제 브라우저에서 렌더링해 테스트하는 프로젝트.
 * StyleX 변환과 alias 는 해당 앱 `.storybook/main.ts` 의 viteFinal 에서 그대로 들어온다.
 */
const storybookProject = async (app: string) => {
  const appDir = path.join(monorepoRoot, 'apps', app);

  return {
    plugins: await storybookTest({ configDir: path.join(appDir, '.storybook') }),
    test: {
      name: `storybook-${app}`,
      // storybookTest 는 프로젝트 root 를 `.storybook` 의 상위(=앱 디렉터리)로 고정한다.
      // dir 을 같이 맞춰주지 않으면 스토리 include 가 모노레포 루트 기준으로 만들어져 어긋난다.
      dir: appDir,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  };
};

export default defineConfig({
  test: {
    projects: [
      './apps/blog',
      './apps/woolbank',
      './apps/woolta',
      './apps/ssr-test',
      './libs/wds',
      './libs/article-curations/features',
      './libs/memo/features',
      './libs/todo/features',
      await storybookProject('blog'),
      await storybookProject('woolbank'),
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
  },
});
