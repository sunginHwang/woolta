import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';
import { storybookStylexPostcss, stylexCssHmrPlugin } from '../../../tools/stylex/storybookStylex.mjs';
import { viteStylexPlugin } from '../../../tools/stylex/viteStylexPlugin.mjs';
import { workspaceAlias } from '../../../tools/workspaceAlias.mjs';

const STYLEX_CSS_PATH = fileURLToPath(new URL('./stylex.css', import.meta.url));
const appRoot = path.dirname(path.dirname(STYLEX_CSS_PATH));
const monorepoRoot = path.join(appRoot, '../..');

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
  // StyleX 변환과 워크스페이스 alias 는 Vitest 와 같은 모듈을 공유한다.
  // StyleX CSS 는 .storybook/stylex.css 의 @stylex 를 postcss 가 치환해 들어온다(앱의 postcss.config.js 는 옵션이 달라 쓰지 않는다).
  viteFinal: async (viteConfig) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(viteConfig, {
      plugins: [viteStylexPlugin(), stylexCssHmrPlugin(STYLEX_CSS_PATH)],
      resolve: { alias: workspaceAlias },
      css: {
        postcss: storybookStylexPostcss([
          path.join(appRoot, '**/*.{ts,tsx}'),
          path.join(monorepoRoot, 'libs/**/src/**/*.{ts,tsx}'),
          `!${path.join(appRoot, '.next/**')}`,
        ]),
      },
    });
  },
};

export default config;
