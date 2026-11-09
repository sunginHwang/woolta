import path from 'node:path';
import stylexPostcss from '@stylexswc/postcss-plugin';
import type { Plugin } from 'vite';
import { workspaceRoot } from '../workspaceRoot.mjs';

/**
 * 스토리북(Vite)용 StyleX CSS 추출 설정.
 *
 * Vite 측 변환(viteStylexPlugin)은 클래스명만 만들고 CSS 를 주입하지 않는다. CSS 는 `.storybook/stylex.css` 의
 * `@stylex;` 지시자를 postcss 가 치환할 때만 나오므로, 각 스토리북은 이 설정을 `css.postcss` 로 넘겨야 한다.
 * rsOptions 는 viteStylexPlugin 과 반드시 같아야 클래스명이 일치한다 — 앱 빌드용 tools/stylex/stylexRsOptions.js 는
 * enableDebugClassNames 등이 달라 쓸 수 없다.
 */
export const storybookRsOptions = {
  dev: true,
  runtimeInjection: false,
  aliases: {
    '@wds/*': [path.join(workspaceRoot, 'libs/wds/src/lib/style/*')],
  },
  unstable_moduleResolution: { type: 'commonJS' as const },
};

/**
 * @param include 추출 대상 glob. 스토리·테스트 파일은 호출부에서 빼지 않아도 여기서 제외한다
 */
export function storybookStylexPostcss(include: string[]) {
  return {
    plugins: [
      stylexPostcss({
        include: [
          ...include,
          `!${path.join(workspaceRoot, '**/node_modules/**')}`,
          `!${path.join(workspaceRoot, '**/*.stories.*')}`,
          `!${path.join(workspaceRoot, '**/*.{test,spec}.*')}`,
        ],
        useCSSLayers: true,
        rsOptions: storybookRsOptions,
      }),
    ],
  };
}

/**
 * postcss 가 만든 stylex.css 모듈은 컴포넌트 파일을 의존성으로 모른다. 새 stylex.create 가 생겨도
 * stylex.css 를 다시 저장하기 전까지 브라우저에 클래스가 없으므로, 소스 ts/tsx 가 바뀌면 무효화해 재추출시킨다.
 */
export function stylexCssHmrPlugin(stylexCssPath: string): Plugin {
  return {
    name: 'woolta:stylex-css-hmr',
    handleHotUpdate({ file, server }) {
      if (!/\.(tsx|ts)$/.test(file) || file.includes('/node_modules/')) return;

      for (const mod of server.moduleGraph.getModulesByFile(stylexCssPath) ?? []) {
        server.moduleGraph.invalidateModule(mod);
        server.ws.send({
          type: 'update',
          updates: [{ type: 'css-update', path: mod.url, acceptedPath: mod.url, timestamp: Date.now() }],
        });
      }
    },
  };
}
