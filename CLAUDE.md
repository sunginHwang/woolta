# CLAUDE.md

이 파일은 Claude Code가 프로젝트를 이해하는 데 필요한 컨텍스트를 제공합니다.

## 프로젝트 개요

Woolta 서비스들을 관리하는 Turborepo 기반 모노레포입니다.

- **blog**: 기술 블로그 (https://blog.woolta.com/)
- **woolbank**: 가계부/자산 관리 서비스 (https://bank.woolta.com/)
- **woolta**: 서비스들을 한눈에 관리하는 대시보드 앱 (개발 중)

## 기술 스택

- Next.js 16.3.3 (App Router, Turbopack — StyleX는 turbopack 로더 + postcss 추출)
- TypeScript 7.0.2 (네이티브 Go 컴파일러. `tsc6` = TypeScript 6.0.3 escape hatch)
- React 18.2.0
- StyleX 0.19 (스타일링. styled-components 는 제거됨)
- Vitest 4 (유닛 + 스토리 테스트)
- Storybook 10 (`@storybook/nextjs-vite`)
- Jotai (상태 관리)
- TanStack React Query (데이터 페칭)
- Turborepo (모노레포)
- pnpm 9.15.4

## 주요 명령어

```bash
# 설치
pnpm install

# 개발 서버
pnpm turbo run dev --filter=blog
pnpm turbo run dev --filter=woolbank

# 빌드
pnpm turbo run build --filter=blog
pnpm turbo run build --filter=woolbank

# 전체 빌드
pnpm turbo run build

# 테스트
pnpm turbo run test --filter={app-name}
pnpm turbo run test

# 타입체크 (TS7)
pnpm typecheck                                 # turbo, 전 패키지
pnpm turbo run typecheck --filter=woolbank
npx tsc6 --noEmit -p <tsconfig>                # TS6 로 교차검증

# 린트/포맷 (Biome, 루트에서 레포 전체 검사)
pnpm lint          # biome check .
pnpm lint:fix      # biome check --write .
pnpm format        # biome format --write .

# Storybook (Storybook 10 + @storybook/nextjs-vite)
pnpm turbo run storybook --filter=blog        # port 4400
pnpm turbo run storybook --filter=woolbank

# 스토리 테스트 (실제 브라우저 렌더링)
pnpm test:storybook                            # blog + woolbank
npx vitest run --project storybook-woolbank    # 하나만
```

## 프로젝트 구조

```
apps/
├── blog/           # Next.js App Router 기반 블로그
├── woolbank/       # 가계부 앱 (Domain-driven 구조)
├── woolta/         # 메인 웹앱 (개발 중)
└── ssr-test/       # SSR 테스트

libs/
├── common/         # 공유 Hooks, HOC, 유틸리티
└── wds/            # Woolta Design System (Atomic Design)
```

## Path Aliases

```typescript
"@common"        // libs/common/src/index.ts - 클라이언트용
"@common/server" // libs/common/src/server.ts - 서버용
"@wds"           // libs/wds/src/index.ts - 디자인 시스템
```

## 코드 컨벤션

### 스타일
- Biome (린트+포맷 통합, 루트 `biome.json`): lineWidth 120, singleQuote, jsxSingleQuote, trailingComma all, import 자동 정렬(organizeImports)

### 컴포넌트 구조
```
components/ComponentName/
├── index.tsx                 # 메인 컴포넌트 (stylex.create 를 모듈 상단에 둔다)
├── ComponentName.module.css  # StyleX 로 못 쓰는 자손/서드파티 선택자만 (선택)
└── ComponentName.stories.tsx # Storybook (선택)
```

### woolbank 앱의 Domain 구조
```
domains/{feature}/
├── components/    # 도메인 전용 컴포넌트
├── hooks/         # 도메인 전용 훅
└── utils/         # 도메인 전용 유틸
```

## 중요 파일 위치

| 파일 | 설명 |
|-----|-----|
| `turbo.json` | Turborepo 설정, 태스크 파이프라인 정의 |
| `tsconfig.base.json` | 기본 TypeScript 설정, path aliases |
| `biome.json` | Biome 린트/포맷 설정 |
| `vitest.config.mts` | Vitest 루트 설정, 프로젝트 목록 |
| `vitest.shared.mts` | 프로젝트 공용 Vitest 설정 (alias, 테스트 환경, StyleX 플러그인) |
| `pnpm-workspace.yaml` | 워크스페이스 + **pnpm overrides** (package.json 의 `overrides` 는 npm 문법이라 pnpm 이 무시한다) |
| `apps/*/package.json` | 각 앱의 스크립트 및 의존성 |

## 개발 시 주의사항

1. **Node.js 18.0.0 이상 필수**
2. **pnpm 사용**
3. **woolbank 로컬 개발 시 HTTPS 필요** - `local-ssl-proxy` 사용
4. **blog/woolbank에서 SVGR 설정이 다름**
   - blog: SVGR 미사용
   - woolbank: SVGR 활성화 (SVG를 React 컴포넌트로 사용)

## 스타일링

- **StyleX 단일 체계**. styled-components 는 제거됐다.
- 토큰: `@wds/tokens.stylex`(colorVars/shadowVars/zIndexConsts), `@wds/typography.stylex`.
  `defineVars` 키가 `--` 로 시작해 CSS 변수명이 리터럴로 나온다 → CSS 파일에서도 `var(--color-*)` 로 같은 토큰을 읽는다.
- **StyleX 로 표현할 수 없는 것은 CSS Module 로 둔다** — 자손 선택자와 서드파티 DOM 타겟팅이 그렇다.
  `:global()` + 래퍼 클래스로 스코프를 유지한다:
  `calendar.module.css`(react-calendar), `editor.module.css`(CodeMirror),
  `markdownViewer.module.css`, `tiptapEditor.module.css`, `cropper.module.css`
- 전역 스타일: `apps/*/app/global.css`, 다크 토큰은 `@wds/colors/darkTheme.css` (이 CSS 가 단일 소스).
  각 앱 `layout.tsx` 가 `darkTheme.css` → `stylex.css` → `global.css` 순으로 import 한다.
- 전환 규칙과 레시피는 `docs/stylex-migration-guide.md` 참고.

## TypeScript

- **TS7(7.0.2) 이 기본**. `tsc` = TS7, `tsc6` = TS6(6.0.3).
- TS7 은 레거시 컴파일러 API(`lib/typescript.js`)를 제공하지 않는다. API 가 필요한 도구가 생기면
  그 패키지에만 pnpm scoped override 로 TS6 를 주입한다 (예: `react-docgen-typescript>typescript`).
  현재 레포에 API 소비자는 없다 — Storybook docgen 은 `reactDocgen: 'react-docgen'` 으로 고정했다.
- Next 16 은 `experimental.useTypeScriptCli` 가 기본 true 라 `tsc` 바이너리를 spawn 한다 → 빌드 타입체크도 TS7.
- TS7 이 제거한 옵션이라 쓸 수 없는 것: `baseUrl`, `moduleResolution: node10`, `esModuleInterop: false`.
  `tsconfig.base.json` 의 `paths` 는 baseUrl 없이 그 파일(레포 루트) 기준 상대경로로 해석된다.
- 알려진 TS6/TS7 진단 차이: `apps/woolbank/next.config.js` 의 `config.turbopack.rules` 대입을
  TS6 만 expando 선언으로 보고 TS2300 을 낸다. 기준 컴파일러인 TS7 은 클린.

## 테스트

- Vitest + Testing Library (`describe`/`it`/`expect` 는 globals 로 제공)
- 루트 `vitest.config.mts` 가 모든 프로젝트를 모은다
  - 유닛 프로젝트 8개: 각 패키지 `vitest.config.mts` 가 `vitest.shared.mts`(alias, jsdom, StyleX 플러그인)를 공유
  - 스토리 프로젝트 2개(`storybook-blog`, `storybook-woolbank`): `@storybook/addon-vitest` 가 스토리를 실제 크로미움에서 렌더링해 검증
- StyleX 변환(`tools/stylex/viteStylexPlugin.mts`)과 워크스페이스 alias(`tools/workspaceAlias.mts`)는 Vitest 와 Storybook 이 같은 모듈을 공유한다
- `pnpm test` 는 turbo 로 패키지별 유닛 테스트만 돌린다. 스토리까지 포함하려면 루트에서 `npx vitest run`

## 환경별 URL

| 앱 | 로컬 | 운영 |
|---|------|-----|
| blog | localhost:8091 | blog.woolta.com |
| woolbank | bank-local.woolta.com:443 (dev 포트 4200) | bank.woolta.com |
| woolta | localhost:4300 (API 연동 시 local.woolta.com:4433, `pnpm dev:woolta-ssl`) | - |
