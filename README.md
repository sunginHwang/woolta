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
- **Styling**: StyleX 0.19 (+ 서드파티 DOM 용 CSS Module)
- **State Management**: Jotai 2.5.0
- **Data Fetching**: TanStack React Query 5.4.3
- **Animation**: Framer Motion 10.17.4

### 개발 도구
- **Testing**: Vitest 4.1.11 (+ @storybook/addon-vitest), Testing Library, Cypress 12.16.0
- **Linting**: ESLint 8.47.0, Prettier 2.6.2
- **Documentation**: Storybook 10.5.10 (@storybook/nextjs-vite)
- **Bundler**: SWC
- **TypeScript**: 7.0.2 (네이티브). TS6 는 `tsc6` 로 병행 설치

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

## 로컬 HTTPS 개발 환경 설정 (woolbank)

`woolbank` 앱은 로그인 쿠키 공유를 위해 로컬에서도 `https` 로 실행해야 합니다.
`https://bank-local.woolta.com:433` (FE) 이 `https://bank-api-local.woolta.com:8000` (API) 를 호출하는 구조입니다.

### 1. vhost 세팅

`/etc/hosts` 에 로컬 도메인을 등록합니다.

```bash
echo "127.0.0.1 bank-local.woolta.com" | sudo tee -a /etc/hosts
```

수정 후 DNS 캐시를 갱신합니다. (macOS)

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### 2. 인증서 신뢰 설정 (mkcert)

`cert/` 디렉토리의 인증서는 [mkcert](https://github.com/FiloSottile/mkcert) 로 발급된 로컬 인증서입니다.
mkcert 의 로컬 CA 는 **머신마다 다르므로**, 각자 로컬에서 CA 를 신뢰 등록해야 브라우저 인증서 경고(`ERR_CERT_AUTHORITY_INVALID`)가 사라집니다.

```bash
# mkcert 설치 (Homebrew)
brew install mkcert

# 로컬 CA 를 시스템 신뢰 저장소에 등록 (관리자 암호 필요)
mkcert -install
```

> `cert/` 의 인증서가 다른 개발자 머신의 CA 로 서명되어 브라우저가 신뢰하지 못하는 경우, 아래 명령으로 본인 머신 CA 기준으로 재발급합니다.
>
> ```bash
> mkcert -cert-file cert/bank-local.woolta.com+2.pem \
>   -key-file cert/bank-local.woolta.com+2-key.pem \
>   bank-local.woolta.com localhost 127.0.0.1
> ```
>
> 재발급한 인증서는 본인 머신 CA 서명이라 공유되지 않으므로 커밋하지 않습니다.

### 3. local-ssl-proxy 적용

FE 로컬 서버(4200)를 ssl 433 포트에 할당합니다. (미설치 시 `npm install -g local-ssl-proxy`)

```bash
local-ssl-proxy --source 433 --target 4200 \
  --cert cert/bank-local.woolta.com+2.pem \
  --key cert/bank-local.woolta.com+2-key.pem
```

### 4. 앱 실행

```bash
nx serve woolbank   # next dev -p 4200
```

이후 `https://bank-local.woolta.com:433` 으로 접속합니다.
API 주소는 `apps/woolbank/.env.local` 의 `NEXT_PUBLIC_BANK_API` 로 설정되어 있습니다.

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
pnpm turbo run storybook --filter=blog       # port 4400
pnpm turbo run storybook --filter=woolbank

# 빌드
pnpm turbo run build-storybook --filter=blog

# 스토리 테스트 (@storybook/addon-vitest, 실제 크로미움 렌더링)
pnpm test:storybook
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
