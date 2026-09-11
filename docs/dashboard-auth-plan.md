# 대시보드 인증 계획 — 로그인 게이트 · 로그인 페이지 · 로그아웃

## Context

대시보드(`apps/woolta`)에는 **인증 게이트가 없다.** 미로그인 상태로 진입하면 화면은 뜨지만
사용자별 데이터(todo/memo/article/bank)가 전부 비어 보인다 — "로그인이 필요하다"는 신호가 없다.
로그인 화면도 로그아웃 수단도 없어서, 지금은 `bank.woolta.com` 에서 로그인해야 대시보드가 동작한다.

세션 API 는 이미 준비돼 있다 — `libs/user/features` 가 `loginBySocial` / `loginByShareCode` /
`logout` / `me` 훅을 노출한다(woolta-api `user` 도메인). **API 는 그대로 쓰고 화면만 새로 만든다.**

**목표** — ① 미로그인 진입 시 로그인 페이지로 이동 ② 대시보드 결에 맞는 로그인 페이지 ③ 좌측 레일 최하단 로그아웃.

## 결정 사항

- **게이트 범위**: `/login` 을 제외한 **전 라우트 보호**
- **구글 SDK**: `@react-oauth/google` (현행 Google Identity Services). bank 가 쓰는
  `@dump-work/react-google-login` 은 폐기된 `react-google-login` 의 포크라 새 페이지에 들이지 않는다.
  서버가 GOOGLE 을 `id_token` 으로 검증하므로 `credential` 을 그대로 넘기면 맞는다
- **디자인**: 대시보드 결을 따른다 — stylex + `@wds/tokens.stylex` 의 `colorVars`, `@wds` 의 `Text`,
  `react-icons/fi`, rem 단위. 별도 UI 킷을 들이지 않는다

## 선행 조건 (서버)

woolta-api 에 provider 자격증명이 없으면 **로그인이 닫힌다**(`SocialAuthService` 가 fail-closed).

```bash
export GOOGLE_CLIENT_ID=...      # 구글 콘솔의 OAuth 클라이언트 ID
export KAKAO_APP_ID=...          # 카카오 앱 ID (JS 키와 별개)
```

FE 에는 공개 키가 필요하다 — `apps/woolta/.env` 에 추가:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_KAKAO_JS_KEY=...
```

> bank 는 이 값들을 소스에 하드코딩해 뒀다(`SocialLogin.tsx:11-15`). 새 페이지는 env 로 받는다.
> 클라이언트 ID·JS 키는 공개 값이지만 앱마다 다를 수 있어 소스 상수로 두면 환경 분리가 안 된다.

## 1. 로그인 게이트

`apps/woolta` 에는 미들웨어가 없다. `apps/woolbank/proxy.ts` 와 같은 방식으로 신설한다.

**신규**: `apps/woolta/proxy.ts`

- `/login` 과 정적 자산(`_next/*`, `favicon.ico`, `api/*`)은 통과
- 그 외는 `${NEXT_PUBLIC_GRAPHQL_API}/user/graphql` 에 `{ checkAccess }` 를 요청 쿠키와 함께 POST
- 실패(errors 또는 falsy) → `/login` 으로 redirect. 원래 목적지를 `?next=` 로 실어 로그인 후 복귀시킨다
- **응답의 `Set-Cookie` 를 반드시 흘려보낸다.** access 만료 시 서버가 refresh 를 1회용으로 소비하고
  새 토큰쌍을 내려주는데, 그걸 버리면 브라우저에 폐기된 refresh 가 남아 다음 요청이 재사용으로
  감지되고 로그인 패밀리 전체가 폐기된다(강제 로그아웃). `apps/woolbank/proxy.ts` 의 `forwardSetCookie`
  와 동일한 처리가 필요하다
- TLS 검증 비활성화는 넣지 않는다(로컬 API 는 평문 HTTP)

> 공통화 여부: 같은 로직이 bank 에도 있으므로 `libs/common/src/server.ts`(`@common/server`)로 뽑을
> 후보다. 다만 미들웨어 런타임 제약이 있어 react-query 를 끌고 오는 모듈을 import 하면 안 된다 —
> 순수 fetch 유틸만 옮긴다. 1차에서는 앱 로컬로 두고, bank 통합 시 함께 정리한다.

## 2. 로그인 페이지

**신규**: `apps/woolta/app/login/page.tsx` + `apps/woolta/components/login/**`

정적 라우트가 `[appKey]` 동적 라우트보다 우선하므로 `/login` 은 정상적으로 잡힌다.

### 레이아웃 문제 — 로그인 화면에는 레일이 없어야 한다

`app/layout.tsx` → `Providers` → `AppShell` 이 항상 `AppRail`(좌측 레일)을 렌더한다.
`AppShell` 에서 `usePathname()` 이 `/login` 일 때 레일 없이 `children` 만 렌더하도록 분기한다.
`Providers` 는 유지해야 한다 — 로그인 뮤테이션이 QueryClient 를 쓰고 테마도 적용돼야 한다.

### 화면 구성

- 중앙 정렬 카드. `bgPage` 배경 위 `bgSurface` 카드, `borderSubtle` 테두리, 라운드 `1.2rem` 이상
- 제목 `Text variant='title3Bold' color='textPrimary'`, 설명 `body2 / textSecondary` (`AppPlaceholder` 결)
- 소셜 로그인 버튼 2개(구글 · 카카오). 레일 아이템처럼 높이·라운드·hover 배경을 토큰으로 맞춘다
- 공유코드 로그인 입력 1개 + 버튼 (읽기 전용 세션 진입 경로)
- 실패 시 카드 안에 인라인 에러 문구. `alert` 는 쓰지 않는다

### 동작

- 구글: `GoogleOAuthProvider` + `useGoogleLogin`(또는 `GoogleLogin`) → `credential`(id_token) →
  `loginBySocial({ token: credential, loginType: 'GOOGLE' })`
- 카카오: JS SDK 로 `access_token` 획득 → `loginBySocial({ token, loginType: 'KAKAO_TALK' })`
- 공유코드: `loginByShareCode(code)`
- 성공 시 `?next=` 가 있으면 그곳으로, 없으면 `/` 로 `router.replace`
- 세션 캐시는 `useLoginBySocial` / `useLoginByShareCode` 가 이미 비운다(`queryClient.clear()`)

> **socialId 를 클라이언트가 보내지 않는다.** 서버가 provider 토큰을 되물어 검증하고 거기서 확인된
> 식별자만 쓴다. bank 의 레거시 REST 는 클라이언트가 보낸 socialId 를 신뢰했다 — 그 방식으로 돌아가지 않는다.

## 3. 로그아웃 (좌측 레일 최하단)

`apps/woolta/components/layout/app-shell/AppRail.tsx` — 설정 버튼 **아래**에 추가.
레일은 `spacer` 로 하단 정렬돼 있어 접기 → 설정 → 로그아웃 순서가 된다.

- `FiLogOut` 아이콘 + 확장 시 '로그아웃' 라벨. 기존 `itemProps(false)` 스타일 재사용
- `useLogout()`(`@woolta/user-features`) 호출 → `router.replace('/login')`
- 확인 절차: `ConfirmProvider` 가 이미 있으므로 `@wds` 의 confirm 을 쓴다(bank 도 확인 후 로그아웃)
- 실패해도 `/login` 으로 보낸다 — 서버 폐기가 실패하더라도 클라이언트 세션은 버리는 게 안전하다

## 파일 변경 요약

| 구분 | 경로 |
|---|---|
| 신규 | `apps/woolta/proxy.ts` |
| 신규 | `apps/woolta/app/login/page.tsx` |
| 신규 | `apps/woolta/components/login/LoginCard.tsx` 등 |
| 수정 | `apps/woolta/components/layout/app-shell/AppShell.tsx` (`/login` 레일 제외) |
| 수정 | `apps/woolta/components/layout/app-shell/AppRail.tsx` (로그아웃 버튼) |
| 수정 | `apps/woolta/package.json` (`@woolta/user-features`, `@react-oauth/google` 추가) |
| 수정 | `apps/woolta/.env` (provider 공개 키) |

`@woolta/user-features` 는 현재 `apps/woolta` 의 직접 의존성이 아니다(transpilePackages 에만 있고
transitive 로 해결되고 있다). 직접 import 하므로 dependencies 에 명시한다.

## 검증

1. `npx tsc --noEmit -p apps/woolta/tsconfig.json`, `npx biome check apps/woolta`
2. 쿠키 없이 `/todo` 진입 → `/login?next=/todo` 로 이동
3. `/login` 에 레일이 없는지, 테마(라이트/다크) 모두 확인
4. 공유코드 로그인 → `/` 진입 → 레일 로그아웃 → `/login` 복귀
5. 소셜 로그인은 서버 `GOOGLE_CLIENT_ID` / `KAKAO_APP_ID` 설정 후 확인 (미설정 시 fail-closed)
6. access 만료 상태로 진입해 게이트가 쿠키를 흘려보내는지 — 재진입 시 로그아웃되지 않아야 한다
