# REST → GraphQL 이관 계획 (blog · woolBank FE)

## Context

woolta-api는 blog·woolBank·user 도메인 GraphQL을 **이미 전부 제공한다**(blog 5Q/6M, woolBank 14Q/18M,
user 3Q/5M — 실측 확인). 그런데 FE는 아직 axios REST로 레거시 백엔드(Spring blog API, Koa woolbankApi)를
호출한다. todo/memo/article만 GraphQL로 넘어간 상태다.

이 어긋남이 실제 문제를 만든다. `NEXT_PUBLIC_BLOG_API` 한 변수가 성격이 다른 두 백엔드를 겸하는데,
지금 그 둘은 **서로 다른 서버**에 있다:

```
/post/categories/...   → 레거시 Spring  (운영에만 존재)
/{domain}/graphql      → woolta-api     (로컬에만 존재)
```

변수 하나로 양쪽을 가리킬 수 없어서, 로컬에서 blog 화면과 대시보드 GraphQL을 동시에 띄울 수 없다.
FE가 GraphQL로 넘어가면 이 충돌은 근본적으로 사라진다.

**목표** — blog·woolBank FE의 REST 호출을 woolta-api GraphQL로 전환하고, 레거시 두 백엔드를 내린다.

## 현재 상태

| lib | `.graphql` 문서 | axios 파일 | 상태 |
|---|---|---|---|
| `libs/todo/features` | 2 | — | 이관 완료 |
| `libs/memo/features` | 1 | — | 이관 완료 |
| `libs/article-curations/features` | 1 | — | 이관 완료 |
| `libs/blog/features` | 0 | 6 | **이관 대상** |
| `libs/woolbank/features` | 0 | 3 | **이관 대상** |
| `apps/woolbank/domains/**` | 0 | 다수 | **이관 대상** (아래 이중 구조 참고) |

## 이관 패턴

todo/memo/article이 템플릿이다. 절차와 규칙은 [`docs/graphql-codegen.md`](./graphql-codegen.md)에 이미
정리돼 있으니 그대로 따른다. 도메인 하나당 작업 단위:

1. `libs/{domain}/features/src/_shared/api/fetcher.ts` — `createGraphqlFetch('{domain}')` (`@common/graphql`에서 import)
2. 같은 폴더에 `{model}.graphql` — 상단에 `fragment {Model}Parts`, 이어서 query/mutation.
   오퍼레이션 이름은 PascalCase이고 **서버 루트 필드명과 동일**, 전 도메인에서 유일해야 한다.
3. 루트 `codegen.ts`의 `generates`에 한 줄 등록
4. lib `.eslintrc.json`의 `ignorePatterns`에 `**/*.generated.ts` 추가
5. lib `package.json`에 `@tanstack/react-query` 확인
6. `_shared/types.ts` — 생성된 fragment 타입을 alias 하고 서버 enum을 re-export.
   손으로 쓰는 타입은 클라이언트 전용 UI 상태만 남긴다
7. `_shared/hooks/use{Model}.ts` (`'use client'` 없음) — 읽기 + 캐시 + prefetch를 한 모듈이 소유한다.
   Suspense 읽기 훅, `use{Op}Query.getKey()` 기반 무효화 함수, `.fetcher(vars, toPrefetchHeaders(options))`
   기반 `prefetch{Model}`
8. `_shared/hooks/use{Model}Mutations.ts` (`'use client'`) — 생성된 mutation을 감싸고 각 `onSuccess`에서
   7번 모듈의 무효화 함수를 호출. `mutateAsync`는 호출자가 await 하는 곳에만
9. `screens/src/prefetch{Domain}Screens.ts` — 위 prefetch들의 `Promise.all`.
   라우트에서 `dynamic = 'force-dynamic'` + `new QueryClient()` +
   `cookie: (await cookies()).toString()` + `HydrationBoundary`
   (사이드바가 layout에 있으면 layout, 없으면 page). `error.tsx`도 함께 둔다
10. `pnpm codegen` → `npx tsc --noEmit -p libs/{domain}/features/tsconfig.json`

> **제약: 생성 파일당 fetcher는 1개.** `codegen.ts`의 `fetcher: { func: './fetcher#gqlFetch' }`가
> 생성 파일 기준 상대 경로라서, 하나의 생성 파일은 **하나의 GraphQL 도메인**만 바라본다.
> 한 lib이 두 도메인(예: woolBank + user)을 써야 하면 폴더와 codegen 엔트리를 둘로 나눠야 한다.
> 이게 Phase 1에서 user 도메인을 별도 lib으로 빼는 이유다.

---

## Phase 0 — 선행 작업 ✅ 완료 (2026-09-04)

세 항목 모두 적용·검증 완료. 아래 내용은 배경과 재현을 위해 남긴다.

### 0.1 GraphQL 호스트를 REST 호스트와 분리 ✅

이관 기간에는 REST와 GraphQL이 공존해야 하므로 변수를 쪼갰다. Phase 4에서 폴백을 제거하고 수렴시킨다.

- `libs/common/src/lib/utils/graphqlFetch.ts` — `getGraphqlHost()`가
  `NEXT_PUBLIC_GRAPHQL_API(_BROWSER)`를 먼저 보고, 없으면 기존 `NEXT_PUBLIC_BLOG_API*`로 폴백한다
  (설정하지 않은 환경의 동작을 그대로 보존)
- `apps/woolta/next.config.js` — `/api/gql/:path*` → `${NEXT_PUBLIC_GRAPHQL_API}/:path*` rewrite 추가
- `apps/woolta/.env.local` — `NEXT_PUBLIC_GRAPHQL_API=http://localhost:4500`,
  `NEXT_PUBLIC_GRAPHQL_API_BROWSER=/api/gql`. `NEXT_PUBLIC_BLOG_API` 오버라이드는 제거해
  `.env`의 운영 Spring 값을 쓴다

검증: blog REST(`/api/blog/post/categories`) → 운영 Spring 9건 `code: SUCCESS`,
GraphQL(`/api/gql/blog/graphql`) → 로컬 API `categoryList.totalCount 9`. 양쪽 동시 동작 확인.

### 0.2 `user_refresh_token` 테이블 생성 ✅

`RefreshTokenService.save()`/`consume()`이 무조건 이 테이블을 읽고 쓰므로, 없으면 로그인과 refresh
회전이 `INTERNAL_SERVER_ERROR`로 실패한다. `woolBank` DB에 적용 완료.

```bash
mysql -h <host> -u <user> -p woolBank < woolta-api/scripts/userRefreshTokenDdl.sql
```

검증: refresh 쿠키만 실은 요청이 `w.access`/`w.refresh` 재발급(Set-Cookie 2건) 후 정상 응답.
운영 DB 스키마 변경이므로 `prisma db push` 금지 — 이 스크립트로만.

### 0.3 blog 도메인 인증 배선 ✅

이전에는 blog Mutation 6개 전부 가드가 없고 Apollo context에 `auth`조차 주입되지 않았다.
`app.ts`의 blog context에 `buildAuthContext`를 주입하고, 신규 `requireBlogAdmin`
(`woolta-api/src/apps/blog/middlewares/requireBlogAdmin.ts`)을 쓰기 4개에 걸었다.

| 오퍼레이션 | 가드 |
|---|---|
| `categoryList`, `postList`, `post`, `getRecentPostList`, `user` | 공개 |
| `subscribeWebPush`, `unsubscribeWebPush` | 공개 (익명 방문자가 구독) |
| `createPost`, `updatePost`, `deletePost`, `sendPushToAll` | `requireBlogAdmin` |

`requireRealUser`만으로는 "로그인한 woolta 유저 아무나"가 되므로 `BLOG_ADMIN_USER_IDS` 허용목록을
함께 검사한다. **미설정 시 `FORBIDDEN`으로 닫힌다**(`myExtension: BLOG_ADMIN_NOT_CONFIGURED`) —
설정 누락이 전체 공개가 되지 않도록.

근본 원인은 **두 유저 테이블이 연결되지 않은 것**이다: blog DB(`user.no`, `userId`, `isAdmin`)와
woolBank DB(`user.id`, `socialId`)는 별개 DB의 별개 테이블이고 인증 쿠키의 `userId`는 후자다.
그래서 작성자 신원은 여전히 `BLOG_AUTHOR_USER_NO` 스텁이 담당한다. blog user 테이블에 woolBank
userId 매핑 열을 추가하고 `isAdmin`을 권한 기준으로 삼으면 허용목록과 스텁을 함께 걷어낼 수 있다.

---

## Phase 1 — user / 세션 도메인 ✅ 대부분 완료 (2026-09-04)

로그인·세션은 blog·bank·대시보드가 모두 쓰는 횡단 관심사다. 위 fetcher 제약 때문에 별도 lib으로 뺀다.

**신설**: `libs/user/features/src/_shared/api/` — `fetcher.ts`(`createGraphqlFetch('user')`) + `user.graphql`,
`codegen.ts`에 엔트리 추가.

| 현재 REST | GraphQL | 호출처 |
|---|---|---|
| `GET /user` | `me` | `apps/woolbank/hooks/queries/useUserInfo.ts`, `libs/woolbank/features/src/_shared/hooks/useUserInfo.ts` |
| `GET /user` (raw fetch, 페이지 인증 게이트) | `me` 또는 `checkAccess` | `apps/woolbank/proxy.ts:41` |
| `POST user/login/social` | `loginBySocial` | `domains/user/login/social-login/_common/hooks/useSocialLogin.ts:18` |
| `POST /user/share-code-login` | `loginByShareCode` | `domains/user/login/id-login/IdLogin.tsx:15` |
| `POST /user/logout` | `logout` | `domains/my-page/my-page-main/user-info-card/UserInfoCard.tsx:68` |
| `GET /auth/share-code` | `getShareCode` | `domains/my-page/share-code/_common/hooks/useShareCode.ts:9` |
| `POST /auth/share-code` | `upsertShareCode` | `.../useShareCode.ts:18` |
| `GET /user/check/jwt` (blog) | `checkAccess` | `libs/blog/features` |

**적용 결과** — `libs/user/features` 신설(fetcher + `user.graphql` + codegen 등록, 훅 11개 생성).
bank 쪽 6개 호출처를 모두 교체했다: 소셜 로그인, 공유코드 로그인, 로그아웃, 공유코드 조회/발급,
`me` 조회(앱·lib 두 사본), 페이지 인증 게이트(`proxy.ts`).

provider 토큰은 두 SDK 응답에서 이미 얻을 수 있었다 — Google 은 `response.tokenId`(= `tokenObj.id_token`),
Kakao 는 `onSuccess({ response })` 의 `response.access_token`(기존 코드가 `response` 를 버리고 있었다).
`loginType` 은 UPPER_CASE(`GOOGLE` / `KAKAO_TALK` / `FACEBOOK`)로 바꿨다.

**남은 것** — 서버에 `GOOGLE_CLIENT_ID` / `KAKAO_APP_ID` / `FACEBOOK_APP_ID`+`FACEBOOK_APP_SECRET` 가
필요하다. 미설정이면 로그인이 닫히므로 실제 로그인 검증은 이 값들을 넣은 뒤에 해야 한다.
blog 쪽 `GET /user/check/jwt` 2건은 Phase 2 로 넘겼다 — blog 화면의 '현재 사용자'가 blog DB 유저 레코드인지
woolBank `me` 인지 의미를 먼저 정해야 한다(0.3 의 테이블 미연결 문제와 같은 뿌리).

---

## Phase 2 — blog FE ✅ 완료 (2026-09-13)

**범위는 두 곳이다** — `libs/blog/features`(8 엔드포인트/10 호출처, `apps/woolta` 대시보드가 소비)와
`apps/blog` 독립 앱(12 호출처). 총 12개 고유 엔드포인트/23개 호출처이며 **axios 클라이언트가 둘로 분리**돼
있다(`libs/blog/features/src/_shared/api/index.ts`, `apps/blog/utils/api/index.ts`). bank와 같은 이중 구조다.

**진행 상태 (2026-09-04)**

- ✅ `libs/blog/features` — 이관 완료. `post.graphql`(fragment 2 + 오퍼레이션 7) → 훅 11개 생성,
  `useCategories` / `usePostList` / `usePost` / `useDeletePost` / `useUpsertPost` / `prefetch.ts` 교체.
  목록 prop 타입을 손으로 쓴 `IPost` 에서 생성 fragment 타입(`PostSummary` / `PostDetail`)으로 바꿨다.
- ✅ 사용자·로그인 — `libs` 와 `apps/blog` 두 사본 모두 `/user/check/jwt` → 공용 `me`.
  아이디/비번 로그인은 제거하고 `/login` 을 `NEXT_PUBLIC_LOGIN_URL`(공용 소셜 로그인 화면)로 위임했다.
  `components/login/main/Main.tsx` · `hooks/queries/useLogin.ts` 삭제.
- ✅ `apps/blog` — 훅을 하나씩 옮기는 대신 **중복 자체를 없앴다**(2026-09-13). 앱이 `@blog/features`
  컴포넌트를 직접 쓰고, 복제본 `components/{home,posts,post,write}` 와 훅 6개를 지웠다.
  `utils/api/index.ts`(axios + 하드코딩 JWT)도 함께 제거. 앱에는 레이아웃·SEO·PWA 만 남는다.
- ✅ 푸시 — `push.graphql` 추가 → `subscribeWebPush` / `unsubscribeWebPush`.
  서비스워커 콜백에서 쓰므로 훅이 아니라 생성된 fetcher 를 감싼 `_shared/hooks/webPush.ts` 로 노출한다.
- ✅ 사이트맵 — `fetchAllPosts()`(= `postList` 인자 생략)로 전체 67건. 아래 '서버에 없는 것' 표의
  전체 글 목록 항목은 **오판이었다** — 전용 쿼리가 필요 없다.
- ✅ 이미지 업로드 — woolta-api 로 이관. 경로만 다르고(`/blog/file/upload/image`) 응답 봉투는 같다.
  호스트는 `getGraphqlHost()` 로 통일했고, 쿠키 세션을 쓰므로 `settingAccessHeaderToken` 은 삭제했다.
  이로써 blog 계열에서 axios 와 레거시 호스트 의존이 **완전히 사라졌다**.

**실측 확인** — `CategoryList` 9건, `GetRecentPostList` 20건/total 67, `PostList(1)` 19건,
`Post` 상세(content 4888자 + writer), `DeletePost` 미인증 시 `UNAUTHENTICATED`.

**'최신' 탭 매핑은 실측으로 확정했다.** 레거시 `GET /post/categories/new/posts` 는 정확히 20건·내림차순이었고
`getRecentPostList`(기본 take 20, `orderBy desc`)와 일치한다. `postList` 는 서버 정렬이 없어
카테고리 탭에서는 클라이언트 정렬을 유지했다.

**남은 과제 — '쓸 수 있는지'를 서버가 알려주지 않는다.** 쓰기 권한은 `requireBlogAdmin`
(`BLOG_ADMIN_USER_IDS` 허용목록)이 판단하는데 FE 에는 그 정보가 없다. 그래서 `Title.tsx` 가
`isLogin` 으로 수정·삭제 버튼을 노출하고, 허용목록 밖 사용자는 눌렀을 때 `FORBIDDEN` 을 받는다.
`me` 에 `canWriteBlog` 같은 필드를 추가하거나 blog 도메인에 전용 쿼리를 두는 것이 정공법이다.

읽기를 먼저 옮기고(무위험), 쓰기는 0.3 완료 후 옮긴다.

### 먼저: 서버에 없는 것 2개 (선행 개발 필요)

| 필요한 것 | 현재 REST | 상태 |
|---|---|---|
| **아이디/비밀번호 로그인** | `POST /user/login` (FormData `id`,`password`) — `apps/blog/hooks/queries/useLogin.ts:22` | woolta-api user 도메인에는 `loginBySocial`/`loginByShareCode`만 있다. **신규 mutation 개발 필요** |
| **전체 글 목록** | `GET /post/categories/posts/all` — `apps/blog/utils/blog/siteMapGenerator.ts:22` (사이트맵 생성) | 대응 쿼리 없음. `postList`에 limit 인자를 추가하거나 전용 쿼리 신설 |

**결정(2026-09-04): 아이디/비번 로그인은 소셜로 통일한다. ✅ 적용 완료.** 신규 로그인 mutation 없이
`loginBySocial` 로 수렴했다. blog 는 자체 로그인 화면을 두지 않고 `/login` 을 공용 소셜 로그인 화면으로
위임한다(`NEXT_PUBLIC_LOGIN_URL`) — 쿠키가 `.woolta.com` 공유라 어디서 로그인해도 blog 세션이 성립한다.
~~**남은 공백은 사이트맵용 전체 글 목록 하나뿐이다.**~~ → 공백이 아니었다. `postList` 리졸버가 `categoryId` 를 받지 않으면 where 를 비워 전체를 돌려준다(`PostService.getPostList`). 실측 67건.

| 현재 REST | GraphQL | 호출처 |
|---|---|---|
| `GET /post/categories` | `categoryList` | `_shared/hooks/useCategories.ts:14`, `_shared/prefetch.ts:14` |
| `GET /post/categories/new/posts` | `getRecentPostList` | `post-list/hooks/usePostList.ts:9`, `_shared/prefetch.ts:8` |
| `GET /post/categories/:id/posts` | `postList(input)` | 같은 파일 (categoryId 분기) |
| `GET /post/categories/:cat/posts/:no` | `post(input)` | `post-detail/hooks/usePost.ts:10`, `_shared/prefetch.ts:20` |
| `POST /post` (upsert) | `createPost` / `updatePost` — **분리됨** | `post-write/hooks/useUpsertPost.ts:15`, `apps/blog/components/write/hooks/useUpsertPost.ts:12` |
| `DELETE /post` (body로 전달) | `deletePost` | `post-detail/hooks/useDeletePost.ts:16`, `apps/blog/components/post/hooks/useDeletePost.ts:15` |
| `GET /user/check/jwt` | `me` 또는 `checkAccess` | `_shared/hooks/useUserInfo.ts:17`, `apps/blog/hooks/queries/useUserInfo.ts:18` |
| `POST /push/subscription` | `subscribeWebPush` | `apps/blog/pwa/pushConfig.ts:15` |
| `DELETE /push/subscription` | `unsubscribeWebPush` | `apps/blog/pwa/pushConfig.ts:23` |
| `POST /file/upload/image` | **REST 유지** → `/blog/file/upload/image` | `post-write/hooks/useImageUpload.ts:12`, `apps/blog/hooks/useImageUpload.ts:11` |

`useUpsertPost`가 하나의 REST 호출로 생성·수정을 겸하는데 GraphQL은 mutation이 둘로 나뉘어 있다.
훅을 쪼개거나 훅 내부에서 분기해야 한다. 두 사본 모두 해당된다.

**`getRecentPostList`는 FE 대응처가 없다.** 서버에만 있는 오퍼레이션이므로 `/new/posts`를 `postList`로
옮길 때 어느 쪽을 쓸지 정해야 한다(`postList(categoryId)` vs `getRecentPostList(limitCount)`).

**대시보드의 메모 이미지 업로드 경로가 어긋난다.** `libs/memo/features/src/_shared/utils/uploadMemoImage.ts:26`
이 `{host}/file/upload/image`를 호출하는데 woolta-api의 실제 경로는 `/blog/file/upload/image`다.
`Authorization` 헤더에 쿠키 값을 직접 실어 보내는 것도 현재 인증 방식과 맞지 않는다 — 함께 정리할 것.

---

## Phase 3 — woolBank FE

### 3.0 규모

REST 엔드포인트 **27개**. 이 중 auth/세션 7개(`/user` ×2, 소셜·공유코드 로그인, 로그아웃, 공유코드 조회·발급)는
Phase 1에서 이미 이관했다 — **남은 데이터 API는 20개**다.

서버 커버리지를 확인한 결과 **20개 전부 대응 오퍼레이션이 있다. 신규 서버 개발 없이 이관 가능하다.**
(blog 와 달리 공백이 없다.)

반대로 **FE 소비처가 없는 서버 오퍼레이션이 11개** 있다 — `account` / `accountList` / `createAccount` /
`createDeposit` / `deleteAccount` / `completeAccountExpiration` / `getAccountLastUpdatedDate` /
`getBucketListItemLastUpdatedDate` / `getBucketListLastUpdatedDate` / `mainInfo` /
`deleteAccountBookCategory`. 레거시 Koa에서 이관됐지만 화면이 쓰지 않는다(`accountList` 는 실제 데이터 4건 보유).
**이관 대상이 아니다** — 화면 요구가 생길 때 붙인다.

### 3.1 이중 구조 — 통합 후 한 번에 이관 (결정)

**결정(2026-09-04): `apps/blog` · `apps/woolbank` 는 추후 앱 단위로 통째로 이관한다.**
따라서 앱 사본을 별도로 GraphQL 로 옮기지 않는다 — 통합 시 버려질 코드이기 때문이다.

- 지금: 대시보드가 소비하는 `libs/*` 만 GraphQL 로 이관한다(blog 완료, woolBank 슬라이스 1·2 완료)
- 앱 사본(`apps/blog`, `apps/woolbank`)은 **레거시 REST 상태로 유지**한다. 현재 정상 동작한다
- 앱을 통합할 때 `libs` 로 옮기면서 그 시점에 한 번만 이관한다

이 결정의 대가는 **레거시 백엔드를 그때까지 내릴 수 없다**는 것이다(Spring blog API, Koa woolbankApi).
Phase 4 의 종료 작업은 앱 통합 이후로 미뤄진다.

통합 시 목표 형태는 이미 `libs` 에 고정돼 있으니 그대로 따르면 된다:
enum 은 UPPER_CASE(`EXPENDITURE` / `INCOME` / `REPEAT` / `INSTALLMENT`), id 는 GraphQL `ID`(문자열),
날짜는 ISO 8601 문자열, 목록은 `{ totalCount, itemList }` 래퍼, 타입은 생성 fragment.

**주의 — 앱 사본에만 있는 수정은 통합 때 함께 옮겨야 한다.** 지금 `apps/woolbank` 에만 반영된 것:
버킷 todo 토글 이중 부정 수정, 통계 프리페치 월 하드코딩 수정. 통계·정기지출·버킷리스트 기능 자체가
앱에만 있으므로 통합 시 코드째로 옮겨지며 함께 따라간다.

### 3.1.1 참고 — 두 사본의 차이

| 사본 | 위치 | 소비처 | 커버리지 |
|---|---|---|---|
| A | `apps/woolbank/domains/**` + `hooks/**` | `apps/woolbank` (4200 / bank.woolta.com) | 27개 전부 |
| B | `libs/woolbank/features/**` + `screens/**` | `apps/woolta` 대시보드 `/bank` | 9개만 |

B는 부분 추출이다 — 가계부 CRUD·카테고리·카테고리 이미지만 있고, 통계·정기지출·버킷리스트는 A에만 있다.

통합 시 **B를 정본으로 삼는다.** B가 이미 더 나은 구조를 갖고 있다:

- 서버 안전 fetcher 를 `'use client'` 훅과 분리(`accountBookListApi.ts`) — GraphQL 이관 패턴과 그대로 맞는다
- 라우트 주입(`WoolbankRoutesProvider`), browser/server base URL 분기, lazy 클라이언트
- 가계부 저장 버그가 A에만 있었다(이미 수정)

확인된 어긋남 13건 중 이관에 직접 영향을 주는 것: 저장 동작(수정 완료), base URL 해석, SSR 프리페치 진입 형태
(A는 페이지마다 `AxiosRequestConfig` 를 손으로 조립 / B는 `prefetch*(qc, {cookie})` 한 함수), 선택 모델
(A 라우트 기반 / B atom+라우트), RSC-import 가능성.

타입 중복도 함께 정리된다 — `AccountBook` 3회, `AccountBookDetail`·`AccountBookCategory`·
`AccountBookCategoryImage`·`APIResponse`·`AccountBookSaveForm`·`Todo` 각 2회 선언.

### 3.2 매핑 (남은 20개)

| # | 현재 REST | GraphQL | 비고 |
|---|---|---|---|
| 7 | `GET /account-books?dateTime` | `accountBookList(dateTime: DateTime!)` | 날짜 직렬화 변경 |
| 8 | `GET /account-books/:id` | `accountBook(id: ID!)` | |
| 9 | `POST account-books` | `createAccountBook(input)` | |
| 10 | `PUT account-books/:id` | `updateAccountBook(input)` | **입력 비대칭 유지됨** — 3.4 참고 |
| 11 | `DELETE account-books/:id` | `deleteAccountBook(input)` | |
| 12 | `GET account-books/statistics` | `getAccountBookStatisticList(startDate, endDate, type)` | |
| 13 | `GET /account-book-categories` | `accountBookCategoryList` | |
| 14 | `POST account-book-categories` | `createAccountBookCategory(input)` | |
| 15 | `GET /account-book-category-images` | `accountBookCategoryImageList` | |
| 16 | `GET /regular-expenditures` | `regularExpenditureGroupList(limitCount: Int)` | |
| 17 | `POST regular-expenditures` | `createRegularExpenditure(input)` | |
| 18 | `DELETE /regular-expenditures/:id` | `deleteRegularExpenditure(input)` | |
| 19 | `GET bucket-list` | `bucketListSummaryList(limitCount: Int)` | |
| 20 | `GET bucket-list/:id` | `bucketList(id: ID!)` | |
| 21 | `POST /bucket-list` (multipart) | `createBucketList(input)` + REST 업로드 | **2단계로 분리** |
| 22 | `PUT /bucket-list/:id` (multipart) | `updateBucketList(input)` + REST 업로드 | **2단계로 분리** |
| 23 | `DELETE /bucket-list/:id` | `deleteBucketList(input)` | |
| 24 | `PUT /bucket-list/:id/complete` | `completeBucketList(input)` | |
| 25 | `POST /todo` | `createBucketListTodo(input)` | `bucketListId` 를 Int 로 (현재 string 전송) |
| 26 | `DELETE /todo/:id` | `deleteBucketListTodo(input)` | |
| 27 | `PUT /todo/:id` | `updateBucketListTodoComplete(input)` | |

### 3.3 흐름이 바뀌는 것 3가지

**① 버킷 이미지 업로드가 2단계가 된다.** 지금은 `POST/PUT /bucket-list` 가 multipart 로 이미지까지 함께 받는다.
GraphQL `Create/UpdateBucketListInput` 은 `imageUrl` / `thumbImageUrl` 을 **문자열로** 받으므로,
먼저 `POST /woolBank/file/upload/image` (multer + sharp 80x80 썸네일)로 올려
`{imageUrl, thumbImageUrl}` 을 받고 그 값을 mutation 에 넘긴다. 실패 처리 지점이 두 곳으로 늘어난다.

**② 날짜가 ISO 8601 로 바뀐다.** 지금은 `?dateTime=${new Date(searchDate)}` 로 `Date.toString()` 결과를
그대로(인코딩 없이) 실어 보낸다 — 로케일·타임존 의존. `DateTime` 스칼라를 쓰면 해소되지만,
이관 전후 응답 동등성 비교 시 이 차이를 염두에 둬야 한다. 통계는 `YYYY-MM-DD HH:mm:ss` 포맷을 쓰고 있다.

**③ 목록 응답이 래퍼로 바뀐다.** REST 는 배열을 그대로 주지만 GraphQL 은
`{ totalCount, itemList }` 다. `data ?? []` 로 실패를 삼키던 자리가 전부 바뀐다(3.6-⑨).

### 3.4 서버 스키마 결정 필요 1건

**`UpdateAccountBookInput` 도 `scheduledPaymentType` / `scheduledPaymentDay` / `installmentMonth` 가 없다.**
REST `PUT` 의 비대칭이 서버 스키마에 그대로 이식돼 있다(`CreateAccountBookInput` 에는 있다).
즉 GraphQL 로 옮겨도 **할부·예약결제 정보를 수정할 수 없다.**

- 의도된 제약이면 그대로 두고 화면에서 해당 필드를 수정 불가로 명시한다
- 버그면 서버 스키마·서비스·리졸버를 함께 고친다(woolta-api 작업 → codegen → FE)

이관 착수 전에 정해야 한다. 나중에 고치면 FE 오퍼레이션 문서와 폼을 다시 손대야 한다.

### 3.5 작업 순서 (수직 슬라이스)

위험이 낮은 것부터. 각 슬라이스가 끝날 때마다 화면이 동작하는 상태를 유지한다.

1. **카테고리 · 카테고리 이미지** (#13 #14 #15) — 읽기 위주, SSR 프리페치 4곳이 걸려 있어 프리페치 패턴을 여기서 확립한다
2. **가계부 목록 · 상세 · CRUD** (#7~#11) — 도메인의 핵심. 손으로 만든 캐시 조작(`setQueryData` 약 20곳)을 `getKey()` 기반 무효화로 교체하는 작업이 대부분이다
3. **통계** (#12) — A 에만 있음. 쿼리키 접두사 분리와 `'2024-09'` 하드코딩을 함께 정리
4. **정기지출** (#16~#18) — 독립적이고 작다
5. **버킷리스트 + todo** (#19~#27) — 가장 복잡. 이미지 2단계 분리, todo 토글 버그(3.6-②), 제자리 캐시 변경(3.6-③)

### 3.6 함께 고칠 결함 — 각각 keep/fix 결정 필요

REST 층에서 확인된 결함이다. 그대로 옮기면 GraphQL 에서도 재현된다.

1. ~~가계부 저장이 A에서 죽어 있음~~ — **수정 완료**
2. **버킷 todo 토글이 서버에 원래 값을 보낸다** (`useBucket.tsx:162-167`, 실측 확인).
   `toggleTodo.isComplete` 를 뒤집어 놓고 요청에는 `!toggleTodo.isComplete`(= 원래 값)를 보낸다.
   서버는 그대로, 캐시는 뒤집힌 값 → 매 토글마다 불일치. **fix 권장**
3. **`setQueryData` 가 `prev` 를 제자리 변경하고 같은 참조를 반환** (`useBucket.tsx` 4곳) →
   React Query 가 리렌더를 건너뛸 수 있다. 무효화 방식으로 옮기면 자연히 사라진다
4. **통계 쿼리키가 `'accountBookList'` 접두사를 공유하고 `Dayjs` 인스턴스를 키에 담는다** —
   직렬화 불가라 dehydration 에 부적합. 도메인별 키 분리로 정리
5. **통계 프리페치의 `selectedDate: '2024-09'` 하드코딩** (`app/account-book-statistic/page.tsx:28`, 실측 확인) —
   SSR 하이드레이션이 현재 월과 절대 맞지 않는다. **fix 권장**
6. `proxy.ts` 가 `info.status` 를 읽는데 응답 봉투 필드는 `code` — GraphQL 이관으로 해소됨(Phase 1에서 처리)
7. ~~공유코드 빈 입력 가드가 return 없이 mutation 을 실행~~ — **수정 완료** (Phase 1)
8. **에러 정보 손실** — axios wrapper 4개가 모든 실패를 `new Error(message)` 로 뭉개 status·body 를 버린다.
   401 분기는 빈 껍데기로 존재한다(`utils/api/index.ts:74-76`). GraphQL 은 `extensions.code` 를 주므로
   받을 자리를 만들어야 한다
9. **`queryFn` 이 실패를 데이터로 삼킨다** — 버킷 목록 `[]`, 버킷 상세 `id: -1` 센티넬, 정기지출 `[]`,
   공유코드 `''`. 세션 만료가 "데이터 없음"으로 렌더된다. 이관 시 error 상태로 올려야 한다
10. **provider 키가 소스에 하드코딩** (`SocialLogin.tsx:11-15`) — env 로 옮길 것 (별건)
11. **TLS 검증 비활성화** — `proxy.ts` 는 수정 완료. `apps/woolbank/utils/api/index.ts:5-7` 와
    `.env.local` 의 `NODE_TLS_REJECT_UNAUTHORIZED=0` 은 axios 클라이언트 제거 시 함께 사라진다

### 3.7 검증

슬라이스마다:

1. `pnpm codegen` → `npx tsc --noEmit -p libs/woolbank/features/tsconfig.json`
2. 두 소비처를 **모두** 확인한다 — `apps/woolbank`(4200) 와 `apps/woolta` 대시보드 `/bank`.
   통합을 먼저 했다면 한 번으로 끝난다
3. 이관 전후 응답 동등성 — 같은 화면의 REST 응답과 GraphQL 응답을 비교한다.
   특히 날짜 포맷(3.3-②), 목록 래퍼(3.3-③), enum 표기(UPPER_CASE), null 허용 여부
4. 쿠키 없는 상태에서 가드 동작 — woolBank 는 전 오퍼레이션이 인증을 요구한다
   (Mutation 은 `requireRealUser` 라 공유코드 세션은 거부된다)

## Phase 4 — 정리

- `libs/blog/features`, `libs/woolbank/features`, `apps/woolbank`의 axios 클라이언트·wrapper 제거
- Phase 0.1의 호스트 분리 shim 제거 — `NEXT_PUBLIC_GRAPHQL_API` 하나로 수렴
- 레거시 백엔드 종료: Spring blog API, Koa woolbankApi
  - woolbankApi 종료 시 `ENABLE_WOOLBANK_CRON=1`로 정기지출 cron을 woolta-api에서 켠다
  - `AUTH_REFRESH_STORE_STRICT=1`로 올려 레거시 발급 refresh 토큰을 거부한다
- 포트 4000 충돌 해소 (레거시 woolbankApi 하드코딩)

---

## 횡단 이슈

**응답 규약이 바뀐다.** REST는 `{code, message, data}` 봉투를 쓰고, GraphQL은 `data` /
`errors[].extensions.code`로 오며 `GraphqlFetchError`로 throw된다. 에러 처리·토스트·재시도 로직을
전면 재검토해야 한다. 지금 woolbank FE에는 **인터셉터도 401 처리도 없고**, 에러가 `new Error(message)`로
평탄화된 뒤 대부분의 `queryFn`이 `data ?? []` / `?? null` 식으로 실패를 삼킨다 — 세션이 만료돼도
"데이터 없음"으로 렌더된다. GraphQL의 `extensions.code`를 받을 자리를 먼저 만들어야 한다.

**캐시가 수작업으로 관리된다.** `setQueryData` 호출이 약 20곳, `invalidateQueries`는 한 곳뿐이고
낙관적 업데이트는 없다. 생성 훅의 `getKey()` 기반 무효화로 갈아탈 때 이 수작업 갱신을 걷어내야 한다.
참고로 `'accountBookList'` 상수가 목록·통계·libs 사본 4곳에서 공유된다 — 키 길이가 달라 서로 덮어쓰지는
않지만(`['accountBookList', date]` vs `['accountBookList', start, end, type]`), 접두사 기반 무효화 시
의도치 않게 함께 날아간다. 도메인별로 키를 분리할 기회다.

**날짜 직렬화가 불안정하다.** `/account-books?dateTime=${new Date(searchDate)}` 처럼 `Date.toString()`
결과를 쿼리 파라미터에 그대로 넣는다(`useAccountBookListQuery.ts:32`) — 로케일·타임존에 의존한다.
GraphQL은 `DateTime` 스칼라(ISO 8601)를 쓰므로 이관 시 자연히 해소되지만, 이관 전후 응답 동등성을
비교할 때 이 차이를 염두에 둘 것.

**세션 만료 감지 방식이 바뀐다.** 지금은 문자열 `'jwt expired'` 매칭
(`apps/woolbank/utils/config.ts`의 `accessTokenExpried`). GraphQL은 `extensions.code === 'UNAUTHENTICATED'`다.
참고로 woolta-api는 `buildAuthContext`가 refresh 쿠키로 **자동 회전**하므로 FE의 수동 재발급 로직은 대부분 불필요해진다.

**타입 매핑.** `DateTime` → `string`(ISO 8601), `JSON` → `unknown`, enum은 문자열 유니온(`enumsAsTypes`).
enum 값은 서버가 UPPER_CASE로 노출하고 DB의 레거시 소문자 값과 양방향 매핑한다 — FE는 UPPER_CASE를 쓴다.
현재 손으로 쓴 도메인 타입(`Account`, `AccountBook`, `BucketList` 등)은 생성 fragment 타입으로 대체한다.

**이미지 업로드는 REST로 남는다.** multipart라 GraphQL로 옮기지 않았다. 경로만 woolta-api로 바꾼다
(`/blog/file/upload/image[s]`, `/woolBank/file/upload/image`).

**서버 사이드 fetch는 회전된 쿠키를 반드시 흘려보내야 한다.**

access 가 만료된 상태로 서버(미들웨어·RSC 프리페치)에서 API를 호출하면 `buildAuthContext` 가 refresh
토큰을 **1회용으로 소비**하고 새 토큰쌍을 `Set-Cookie` 로 내려준다. 이 헤더를 브라우저 응답으로
전달하지 않으면 브라우저에는 이미 폐기된 refresh 가 남고, 다음 요청이 재사용으로 감지돼
**로그인 패밀리 전체가 폐기된다(강제 로그아웃).** `AUTH_REFRESH_REUSE_GRACE_MS`(기본 10초) 유예창이
짧게 가려주지만 그 밖에서는 로그아웃 루프가 된다.

`apps/woolbank/proxy.ts` 는 이 문제를 해결했다(응답의 `set-cookie` 를 `NextResponse` 로 append).
**다만 RSC 프리페치(`toPrefetchHeaders` 경로)는 아직 같은 위험을 안고 있다** — 이미 이관된
todo/memo/article 도 해당된다. 프리페치는 `Set-Cookie` 를 버리므로, access 만료 직후 페이지 진입이
refresh 를 소비해 버릴 수 있다. 대응 방향은 두 가지다:
① 프리페치를 만료된 세션에서 아예 건너뛴다(회전을 유발하지 않음),
② 프리페치 응답의 `Set-Cookie` 를 라우트에서 수집해 흘려보낸다.
Phase 4 전에 결론을 내야 한다.

**별건 — `proxy.ts`의 TLS 검증 비활성화 ✅ 수정 완료.** 모듈 최상단의 무조건
`process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` 을 제거했다. `NODE_ENV === 'development'` 가드가 붙은
쪽만 남겨 개발 편의는 유지하고 운영 구멍은 닫았다.

## 검증

각 Phase마다:

1. `pnpm codegen` → `npx tsc --noEmit -p libs/{domain}/features/tsconfig.json`
2. 로컬 전 구간 — 절차는 `woolta-api/docs/LOCAL-DEV.md`
3. 화면별 수동 확인 + 쿠키 없는 상태에서 가드 동작 확인:
   ```bash
   curl -s -X POST https://local.woolta.com:4433/api/gql/blog/graphql \
     -H 'Content-Type: application/json' \
     -d '{"query":"mutation { deletePost(input:{categoryNo:1,postNo:1}) }"}'
   # → extensions.code === "UNAUTHENTICATED" 여야 한다 (Phase 0.3 이후)
   ```
4. 이관 전후 응답 동등성 — 같은 화면의 REST 응답과 GraphQL 응답을 비교한다.
   특히 날짜 포맷, enum 표기, null 허용 여부.
