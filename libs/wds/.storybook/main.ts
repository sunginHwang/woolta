import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';
import { stylexCssHmrPlugin } from '../../../tools/stylex/storybookStylex.mjs';
import { viteStylexPlugin } from '../../../tools/stylex/viteStylexPlugin.mjs';
import { workspaceAlias } from '../../../tools/workspaceAlias.mjs';

// StyleX CSS 는 postcss 가 stylex.css 의 @stylex 를 처리할 때만 추출된다 — HMR 보정은 tools/stylex/storybookStylex 참고
const STYLEX_CSS_PATH = fileURLToPath(new URL('./stylex.css', import.meta.url));

/**
 * WDS(Woolta Design System) 전용 스토리북.
 * wds 는 Next 에 의존하지 않는 순수 React 라이브러리라 react-vite 프레임워크를 쓴다.
 *
 * 사이드바 구조 (storySort 는 preview.tsx):
 *   Intro → Foundations(Colors/Typography/Shadows/Z-Index) → Components → Utilities
 */
const config: StorybookConfig = {
  stories: ['../src/docs/**/*.mdx', '../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // MDX 문서의 GFM 표(| --- |)를 렌더링한다 — Storybook 8+ 는 기본 포함하지 않는다
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // TS7 은 레거시 컴파일러 API 를 제공하지 않으므로 babel 기반 react-docgen 으로 고정한다.
  typescript: { reactDocgen: 'react-docgen' },
  // StyleX 변환과 워크스페이스 alias 는 Vitest 와 같은 모듈을 공유한다
  viteFinal: async (viteConfig) => {
    const { mergeConfig } = await import('vite');

    return mergeConfig(viteConfig, {
      plugins: [viteStylexPlugin(), stylexCssHmrPlugin(STYLEX_CSS_PATH)],
      resolve: { alias: workspaceAlias },
    });
  },
};

export default config;
