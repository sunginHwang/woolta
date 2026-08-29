# CLAUDE.md

이 파일은 Claude Code가 프로젝트를 이해하는 데 필요한 컨텍스트를 제공합니다.

## 프로젝트 개요

Woolta 서비스들을 관리하는 Turborepo 기반 모노레포입니다.

- **blog**: 기술 블로그 (https://blog.woolta.com/)
- **woolbank**: 가계부/자산 관리 서비스 (https://bank.woolta.com/)
- **woolta**: 서비스들을 한눈에 관리하는 대시보드 앱 (개발 중)

## 기술 스택

- Next.js 14.2.1 (App Router)
- TypeScript 5.1.3
- React 18.2.0
- Styled Components 6.1.8
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

# 린트/포맷 (Biome, 루트에서 레포 전체 검사)
pnpm lint          # biome check .
pnpm lint:fix      # biome check --write .
pnpm format        # biome format --write .

# Storybook
pnpm turbo run storybook --filter=blog        # port 4400
pnpm turbo run storybook --filter=woolbank
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
├── index.tsx              # 메인 컴포넌트
├── ComponentName.styles.ts # Styled Components
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
| `apps/*/package.json` | 각 앱의 스크립트 및 의존성 |

## 개발 시 주의사항

1. **Node.js 18.0.0 이상 필수**
2. **pnpm 사용**
3. **woolbank 로컬 개발 시 HTTPS 필요** - `local-ssl-proxy` 사용
4. **blog/woolbank에서 SVGR 설정이 다름**
   - blog: SVGR 미사용
   - woolbank: SVGR 활성화 (SVG를 React 컴포넌트로 사용)

## 테스트

- Jest + Testing Library
- lodash-es는 변환 예외 처리됨 (transformIgnorePatterns)

## 환경별 URL

| 앱 | 로컬 | 운영 |
|---|------|-----|
| blog | localhost:8091 | blog.woolta.com |
| woolbank | bank-local.woolta.com:443 (dev 포트 4200) | bank.woolta.com |
| woolta | localhost:4300 (API 연동 시 local.woolta.com:4433, `pnpm dev:woolta-ssl`) | - |
