import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const monorepoRoot = import.meta.dirname;

/**
 * 스토리를 실제 브라우저에서 렌더링해 테스트하는 프로젝트.
 * StyleX 변환과 alias 는 해당 앱 `.storybook/main.ts` 의 viteFinal 에서 그대로 들어온다.
 */
const storybookProject = async (name: string, packageDir: string) => {
  const projectDir = path.join(monorepoRoot, packageDir);

  return {
    plugins: await storybookTest({ configDir: path.join(projectDir, '.storybook') }),
    test: {
      name: `storybook-${name}`,
      // storybookTest 는 프로젝트 root 를 `.storybook` 의 상위(=패키지 디렉터리)로 고정한다.
      // dir 을 같이 맞춰주지 않으면 스토리 include 가 모노레포 루트 기준으로 만들어져 어긋난다.
      dir: projectDir,
      // addon-vitest 는 test.exclude 를 자기 값으로 덮어써 vitest 기본 제외(node_modules)가 사라진다.
      // 그러면 workspace 심링크(node_modules/@woolta/wds)를 타고 다른 패키지의 스토리까지 수집된다.
      exclude: ['**/node_modules/**'],
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
      './libs/common',
      './libs/wds',
      './libs/article-curations/features',
      './libs/blog/features',
      './libs/calendar/features',
      './libs/woolbank/features',
      './libs/memo/features',
      './libs/todo/features',
      await storybookProject('blog', 'apps/blog'),
      await storybookProject('woolbank', 'apps/woolbank'),
      await storybookProject('wds', 'libs/wds'),
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
  },
});
