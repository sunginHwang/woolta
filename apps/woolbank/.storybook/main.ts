import type { StorybookConfig } from '@storybook/nextjs-vite';
import { viteStylexPlugin } from '../../../tools/stylex/viteStylexPlugin.mjs';
import { workspaceAlias } from '../../../tools/workspaceAlias.mjs';

const config: StorybookConfig = {
  stories: ['../**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  // TS7 은 레거시 컴파일러 API 를 제공하지 않는다. react-docgen-typescript 가
  // 레포의 유일한 API 소비자였으므로 babel 기반 react-docgen 으로 고정해 의존을 끊는다.
  typescript: { reactDocgen: 'react-docgen' },
  // StyleX 변환과 워크스페이스 alias 는 Vitest 와 같은 모듈을 공유한다
  viteFinal: async (viteConfig) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(viteConfig, {
      plugins: [viteStylexPlugin()],
      resolve: { alias: workspaceAlias },
    });
  },
};

export default config;
