import type { StorybookConfig } from '@storybook/nextjs-vite';
import { viteStylexPlugin } from '../../../tools/stylex/viteStylexPlugin.mjs';
import { workspaceAlias } from '../../../tools/workspaceAlias.mjs';

const config: StorybookConfig = {
  // `../**` 같은 넓은 glob 은 workspace 심링크(node_modules/@woolta/wds)를 타고 wds 스토리까지 끌어온다.
  // wds 는 자체 스토리북(libs/wds)이 있으므로 실제 소스 디렉터리만 열거한다.
  stories: [
    '../components/**/*.stories.@(tsx|mdx)',
    '../domains/**/*.stories.@(tsx|mdx)',
    '../../../libs/woolbank/features/src/**/*.stories.@(tsx|mdx)',
  ],
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
