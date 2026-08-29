# GraphQL 코드 생성 가이드

woolta-api(GraphQL) 통합 스키마를 기반으로, 각 도메인 lib 의 `*.graphql` 오퍼레이션 문서를 순회하며
**TypeScript 타입 + TanStack Query v5 훅**을 자동 생성하는 파이프라인 사용법을 정리한다.

```
tools/external-schema/api-autogen.graphql   ← 전 도메인 통합 스키마 (woolta-api 산출물)
        │
        ▼  pnpm codegen  (설정: 루트 codegen.ts)
libs/{domain}/features/src/_shared/api/
├── *.graphql          ← 직접 작성하는 쿼리/뮤테이션 문서
├── fetcher.ts         ← 도메인 전용 gqlFetch (직접 작성, 1회)
└── gql.generated.ts   ← 자동 생성 (직접 수정 금지)
```

## 1. 구조 개요

- **스키마**: `tools/external-schema/api-autogen.graphql`. woolta-api 레포에서 `npm run mergeSchema` 로
  생성한 통합 SDL 을 복사해 둔 것. 서버 스키마가 바뀌면 재생성 후 이 파일을 갱신하고 `pnpm codegen` 을 다시 실행한다.
- **엔드포인트**: woolta-api 는 도메인별로 GraphQL 엔드포인트가 분리되어 있다
  (`/blog/graphql`, `/woolBank/graphql`, `/user/graphql`, `/todo/graphql`, `/memo/graphql`, `/article/graphql`).
  따라서 생성 파일도 도메인 단위로 나누고, 각 도메인이 자기 엔드포인트를 바라보는 fetcher 를 갖는다.
- **fetcher**: `@common` 의 `createGraphqlFetch(domain)` 로 생성.
  - 브라우저: 호스트 앱 rewrites 프록시(`/api/blog`) 경유 — `.woolta.com` 쿠키(JWT)가 그대로 전달된다.
  - 서버(SSR): `NEXT_PUBLIC_BLOG_API`(woolta-api 호스트) 직접 호출.
  - GraphQL 에러는 `GraphqlFetchError`(message, errors, status) 로 throw 된다.

## 2. 명령어

```bash
pnpm codegen         # 전체 도메인 생성
pnpm codegen:watch   # *.graphql 변경 감지 자동 생성
```

## 3. 오퍼레이션 작성 방법

도메인 lib 의 `src/_shared/api/` 아래에 `*.graphql` 파일을 만들고 쿼리/뮤테이션을 작성한다.
(codegen 은 `libs/{domain}/**/*.graphql` 전체를 순회하므로 위치는 자유지만, `_shared/api/` 를 컨벤션으로 한다.)

```graphql
# libs/todo/features/src/_shared/api/todo.graphql
fragment TodoParts on Todo {
  id
  title
  isCompleted
  # ... 화면에서 쓰는 필드만 선언
}

query TodoList {
  todoList {
    totalCount
    itemList {
      ...TodoParts
    }
  }
}

mutation CreateTodo($input: CreateTodoInput!) {
  createTodo(input: $input) {
    ...TodoParts
  }
}
```

작성 규칙:

- **오퍼레이션 이름은 필수**이며 PascalCase 로 쓴다. 이름이 훅 이름이 된다
  (`query TodoList` → `useTodoListQuery`, `mutation CreateTodo` → `useCreateTodoMutation`).
- 오퍼레이션 이름은 **전 도메인에서 유일**해야 한다 (같은 이름이 두 파일에 있으면 codegen 이 실패한다).
- 공통 필드 셋은 fragment 로 뽑아 재사용한다. fragment 는 같은 도메인(documents 글롭) 안에서만 공유된다.
- input 타입/필드명은 스키마(`api-autogen.graphql`)를 그대로 따른다. 스키마에 없는 필드를 쓰면 codegen 단계에서 에러가 난다.

## 4. 생성물 사용법

`gql.generated.ts` 에서 훅과 타입을 import 해 쓴다.

```tsx
import {
  useTodoListQuery,
  useSuspenseTodoListQuery,
  useCreateTodoMutation,
  TodoPartsFragment,
} from '../_shared/api/gql.generated';

// 쿼리
const { data, isLoading } = useTodoListQuery();
const todos: TodoPartsFragment[] = data?.todoList.itemList ?? [];

// 서스펜스 쿼리 (App Router Suspense 경계 내부)
const { data } = useSuspenseTodoListQuery();

// 뮤테이션 + 목록 무효화
const queryClient = useQueryClient();
const { mutate: createTodo } = useCreateTodoMutation({
  onSuccess: () => queryClient.invalidateQueries({ queryKey: useTodoListQuery.getKey() }),
});
createTodo({ input: { title: '새 할 일' } });
```

훅마다 함께 생성되는 유틸:

| 유틸 | 용도 |
|---|---|
| `useXxxQuery.getKey(variables?)` | queryKey — `invalidateQueries` / `setQueryData` 등에 사용 |
| `useXxxQuery.fetcher(variables?)` | 훅 없이 호출 가능한 fetch 함수 — SSR `prefetchQuery`, 이벤트 핸들러 내 단발 호출 등 |
| `useSuspenseXxxQuery` | `useSuspenseQuery` 기반 변형 |

SSR prefetch 예시:

```ts
await queryClient.prefetchQuery({
  queryKey: useTodoListQuery.getKey(),
  queryFn: useTodoListQuery.fetcher(),
});
```

## 5. 새 도메인 추가 절차

memo 도메인을 추가한다고 하면:

1. **fetcher 작성** — `libs/memo/features/src/_shared/api/fetcher.ts`

   ```ts
   import { createGraphqlFetch } from '@common';

   export const gqlFetch = createGraphqlFetch('memo');
   ```

2. **오퍼레이션 작성** — 같은 폴더에 `memo.graphql` 등 문서 작성 (3번 규칙 참고)

3. **codegen.ts 에 도메인 등록** — 루트 `codegen.ts` 의 `generates` 에 한 줄 추가

   ```ts
   'libs/memo/features/src/_shared/api/gql.generated.ts': domainOutput(['libs/memo/**/*.graphql']),
   ```

4. **lint 제외** — 해당 lib `.eslintrc.json` 의 `ignorePatterns` 에 `"**/*.generated.ts"` 추가

5. **의존성 확인** — lib `package.json` dependencies 에 `@tanstack/react-query` 가 없다면 추가

6. `pnpm codegen` 실행 후 `npx tsc --noEmit -p libs/memo/features/tsconfig.json` 으로 검증

## 6. 주의사항

- **`gql.generated.ts` 는 직접 수정 금지.** 수정이 필요하면 `*.graphql` 문서나 `codegen.ts` 설정을 고치고 재생성한다.
  prettier / eslint 대상에서도 제외되어 있다 (`.prettierignore`, lib `ignorePatterns`).
- **codegen.ts 의 plugins 에 `typescript` 플러그인을 추가하지 말 것.**
  `typescript-operations` v6부터 오퍼레이션이 참조하는 input/enum 타입까지 자체 생성하므로,
  `typescript` 플러그인을 함께 쓰면 타입이 중복 선언되어 컴파일 에러가 난다.
- 생성 문서는 plain string 이 아닌 `TypedDocumentString`(String 서브클래스)이다.
  `createGraphqlFetch` 가 이미 처리하므로 fetcher 를 새로 만들 일이 있다면 `query.toString()` 을 사용할 것.
- scalar 매핑: `DateTime` → `string`(ISO 8601), `JSON` → `unknown`. enum 은 런타임 객체 없이
  문자열 유니온 타입으로 생성된다 (`enumsAsTypes`).
- 스키마 파일(`api-autogen.graphql`)은 woolta-api 산출물이므로 이 레포에서 직접 수정하지 않는다.
