# Woolta Monorepo

Woolta 서비스들을 관리하는 Nx 기반 모노레포입니다.

## 프로젝트 개요

| 애플리케이션 | 설명 | URL |
|------------|------|-----|
| **blog** | 기술 블로그 | https://blog.woolta.com/ |
| **woolbank** | 가계부/자산 관리 서비스 | https://bank.woolta.com/ |
| **woolta** | 메인 웹앱 (개발 중) | - |
| **ssr-test** | SSR 테스트 앱 | - |

## 기술 스택

### Core
- **Framework**: Next.js 14.2.1 (App Router)
- **Language**: TypeScript 5.1.3
- **Runtime**: Node.js 18.0.0+
- **Package Manager**: Yarn Berry 4.2.2
- **Monorepo**: Nx 18.2.4

### Frontend
- **UI Library**: React 18.2.0
- **Styling**: Styled Components 6.1.8
- **State Management**: Jotai 2.5.0
- **Data Fetching**: TanStack React Query 5.4.3
- **Animation**: Framer Motion 10.17.4

### 개발 도구
- **Testing**: Jest 29.4.1, Testing Library, Cypress 12.16.0
- **Linting**: ESLint 8.47.0, Prettier 2.6.2
- **Documentation**: Storybook 7.3.0
- **Bundler**: SWC

## 프로젝트 구조

```
woolta/
├── apps/
│   ├── blog/              # 기술 블로그
│   ├── woolbank/          # 가계부 서비스
│   ├── woolta/            # 메인 웹앱
│   └── ssr-test/          # SSR 테스트
├── libs/
│   ├── common/            # 공유 Hooks, HOC, 유틸리티
│   └── wds/               # Woolta Design System
├── tools/                 # 개발 도구
├── nx.json                # Nx 설정
├── tsconfig.base.json     # TypeScript 기본 설정
└── package.json           # 루트 패키지 설정
```

## 공유 라이브러리

### @common
모든 앱에서 공유하는 React Hooks, HOC, 유틸리티 함수 모음

- **Hooks**: `useInput`, `useToggle`, `useInterval`, `useMount`, `useDetectKeyboardOpen` 등 17개
- **HOC**: `withSuspense`
- **Utils**: Next.js 헬퍼, 디바이스 감지, RAF 최적화 등

```typescript
import { useInput, useToggle } from '@common';
import { getServerSidePropsWithPrefetch } from '@common/server';
```

### @wds (Woolta Design System)
Atomic Design 패턴 기반 디자인 시스템

- **Components**: Portal, Text, SkeletonBar, Suspense 등
- **Tokens**: 색상, 폰트, z-index, 애니메이션

```typescript
import { Text, Portal, colors, font } from '@wds';
```

## 요구사항

- Node.js 18.0.0 이상
- Yarn Berry (1.x 사용 불가, berry로 설치)

## 설치

```bash
yarn install
```

## 개발 실행

```bash
# 개별 앱 실행
nx serve blog
nx serve woolbank
nx serve woolta

# 특정 포트 지정
nx serve blog --port=3000
```

## 빌드

```bash
# 개별 앱 빌드
nx build blog
nx build woolbank

# 전체 빌드
nx run-many -t build
```

## 테스트

```bash
# 개별 앱 테스트
nx test blog
nx test woolbank

# 전체 테스트
nx run-many -t test
```

## 린팅

```bash
# 개별 앱 린팅
nx lint blog

# 전체 린팅
nx run-many -t lint
```

## Storybook

```bash
# 실행
nx storybook blog      # port 4400
nx storybook woolbank

# 빌드
nx build-storybook blog
```

## 코드 컨벤션

### TypeScript
- Strict Mode 사용
- ES2015 Target, ESNext Module

### ESLint
- 최대 라인 길이: 120자
- Import 알파벳 정렬
- React Hooks exhaustive-deps 규칙 적용

### Prettier
```json
{
  "printWidth": 120,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

### Path Aliases
```typescript
"@common"       → libs/common/src/index.ts
"@common/server"→ libs/common/src/server.ts
"@common/test"  → libs/common/test/src/index.ts
"@wds"          → libs/wds/src/index.ts
```

## 참고 링크

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
