import path from 'node:path';
import { normalizeRsOptions, SourceMaps, shouldTransformFile, transform } from '@stylexswc/rs-compiler';
import type { Plugin } from 'vite';
import { workspaceRoot } from '../workspaceRoot.mjs';

/** rs-compiler 가 .ts 를 TSX 로 파싱해 제네릭 화살표 함수와 충돌 — 스타일 파일로 한정 */
const include = [/\.stylex\.(ts|js)$/, /\.tsx$/];

const rsOptions = normalizeRsOptions({
  dev: true,
  unstable_moduleResolution: { type: 'commonJS' },
  aliases: {
    '@wds/*': [path.join(workspaceRoot, 'libs/wds/src/lib/style/*')],
  },
  sourceMap: SourceMaps.True,
});

/**
 * Vite 용 StyleX 변환 플러그인 — Vitest 와 Storybook 이 공유한다.
 * StyleX 컴파일이 TS/JSX 변환보다 먼저 돌아야 하므로 `enforce: 'pre'`.
 */
export function viteStylexPlugin(): Plugin {
  return {
    name: 'woolta:stylex',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];

      if (file.includes('/node_modules/') || !shouldTransformFile(file, include, null)) {
        return null;
      }

      const result = transform(file, code, rsOptions);

      return { code: result.code, map: result.map ?? null };
    },
  };
}
