# TODO / 메모 / 아티클 API 전환 스펙

woolta 대시보드의 TODO(`libs/todo`), 메모(`libs/memo`), 아티클 큐레이션(`libs/article-curations`)은 현재
zustand `persist` 로 로컬스토리지에 저장된다. 이 문서는 세 도메인을 API 로 전환할 때 필요한
**리소스 타입, 조회/필터, 생성/수정/삭제 스펙**을 현재 클라이언트 구현 기준으로 정리한 것이다.

- 현재 스토리지 키: `woolta:todos` / `woolta:memos` / `woolta:article-curations`
- 스펙은 REST 기준으로 기술 (woolta-api GraphQL 로 갈 경우 리소스/오퍼레이션 모델은 동일하게 매핑 가능)

---

## 0. 공통 사항

### 인증 / 소유권
- `.woolta.com` 공유 쿠키 JWT(`w.access` / `w.refresh`) 기반. 모든 리소스는 **userId 스코프** — 목록/상세/변경 모두 본인 데이터만.
- 브라우저 호출은 woolta 앱의 rewrites 프록시(`/api/...`) 경유 (가계부/블로그와 동일 패턴).

### ID / 타임스탬프
- 현재 클라이언트가 `crypto.randomUUID()` 로 id 생성 → 전환 후 **id 는 서버 발급**(UUID), 생성/수정 응답으로 전체 엔티티 반환.
- `createdAt` / `updatedAt` / `completedAt` / `deletedAt` 은 서버가 기록 (ISO 8601 UTC).
- `dueDate` 만 예외적으로 날짜 문자열 `YYYY-MM-DD` (시간대 개념 없음 — "오늘" 판정은 클라이언트 로컬 기준이므로 date-only 유지).

### 응답/에러 컨벤션
- 기존 백엔드(woolbankApi/blog API) 컨벤션에 맞춤. 최소 요건:
  - 성공: 엔티티 or 배열
  - 에러: `400`(검증), `401`(인증), `403`(타 유저 리소스), `404`(없음), `409`(비즈니스 제약 위반 — 예: 주간 큐레이션 초과)

### 클라이언트에 남는 상태 (API 대상 아님)
- TODO: `selectedTodoId`, `isDetailVisible`, `viewMode`(list/kanban)
- 메모: `selectedMemoId`
- → UI 상태이므로 로컬(zustand, persist 없이 또는 별도 키) 유지.

### 마이그레이션
- 최초 1회 로컬스토리지 → 서버 이관 필요. 방법 2안:
  1. (권장) 도메인별 **bulk import 엔드포인트** `POST /{domain}/import` — 로컬 데이터 배열 그대로 업로드, 서버가 id 재발급 + 매핑 반환(카테고리 id ↔ todo.categoryId, article id ↔ curation.articleIds 참조 유지 필요)
  2. 클라이언트가 순차 create 호출 (참조 순서: 카테고리 → 아이템 → 큐레이션)
- 이관 완료 후 로컬 키 삭제.

---

## 1. TODO API

### 1.1 타입

```ts
type TodoPriority = 'none' | 'low' | 'medium' | 'high';

interface Todo {
  id: string;
  title: string;
  memo: string;                  // 상세 메모 (plain text)
  dueDate: string | null;        // YYYY-MM-DD
  categoryId: string | null;     // null = 기본함(inbox)
  priority: TodoPriority;
  isCompleted: boolean;
  completedAt: string | null;    // 서버 기록
  deletedAt: string | null;      // soft delete (휴지통), null = 정상
  order: number;                 // 수동 정렬 순서 (서버가 max+1 발급)
  createdAt: string;
  updatedAt: string;
}

interface TodoCategory {
  id: string;
  name: string;                  // 이모지 포함 가능
  order: number;
  createdAt: string;
}
```

### 1.2 조회 / 필터

클라이언트 스마트 리스트(`today` / `upcoming` / `inbox` / `completed` / `trash` / `category:{id}`)가 쓰는
필터 조건 (`useFilteredTodoList`, `useTodoCounts`, `useUpcomingGroups` 기준):

| 리스트 | 조건 | 정렬 |
|---|---|---|
| today | `deletedAt IS NULL AND dueDate = :today` (+ 완료 항목은 하단 별도) | 미완료 `order ASC`, 완료 `completedAt DESC` |
| today의 "지난" 섹션 | `deletedAt IS NULL AND isCompleted = false AND dueDate < :today` | `dueDate ASC` |
| upcoming | `deletedAt IS NULL AND isCompleted = false AND dueDate > :today` | 날짜별 그룹, `dueDate ASC` |
| inbox | `deletedAt IS NULL AND categoryId IS NULL` | 미완료 `order ASC`, 완료 `completedAt DESC` |
| category:{id} | `deletedAt IS NULL AND categoryId = :id` | 동일 |
| completed | `deletedAt IS NULL AND isCompleted = true` | `completedAt DESC` |
| trash | `deletedAt IS NOT NULL` | `deletedAt DESC` |

**엔드포인트**

```
GET /todos
  ?status=active|completed|trash   # default active (deletedAt null 기준, active=전체 alive)
  ?categoryId={id}|inbox           # inbox = categoryId IS NULL
  ?due=overdue|today|upcoming      # 서버는 date 파라미터 기준 비교
  ?date={YYYY-MM-DD}               # "오늘" 기준일 — 클라이언트 로컬 날짜를 명시적으로 전달
```

- v1 은 데이터량이 작으므로 **`GET /todos` 전체(휴지통 포함) 1회 조회 + 클라이언트 필터 유지**도 허용.
  이 경우 필터 파라미터는 v2 로 미뤄도 됨. 단 응답에 위 필드가 전부 있어야 기존 훅이 그대로 동작.
- 사이드바 뱃지 카운트(`useTodoCounts`: overdue/today/upcoming/inbox/completed/trash/카테고리별)는
  전체 조회 시 클라이언트 계산 유지. 서버 필터로 갈 경우 `GET /todos/counts?date=` 추가 필요.

```
GET /todo-categories        # order ASC
```

### 1.3 생성

```
POST /todos
body: {
  title: string;                     // required, 공백 불가
  dueDate?: string | null;           // YYYY-MM-DD
  categoryId?: string | null;        // 존재 검증 (본인 카테고리)
  priority?: TodoPriority;           // default 'none'
}
→ 201 Todo   # memo:'', isCompleted:false, order:max+1 서버 세팅
```

```
POST /todo-categories
body: { name: string }               // required
→ 201 TodoCategory                   # order:max+1
```

### 1.4 수정

```
PATCH /todos/{id}
body: Partial<{ title; memo; dueDate; categoryId; priority }>
→ 200 Todo
```
- 상세 패널은 **제목/메모 자동 저장**(debounce + flush)을 함 → PATCH 는 부분 업데이트·멱등이어야 하고 호출 빈도 감안.
- 칸반 드래그의 카테고리 이동도 이 PATCH(`categoryId`)로 처리 (`moveTodoToCategory`).

```
PATCH /todos/{id}/complete
body: { isCompleted: boolean }       // 토글이 아닌 명시값 (동시성 안전)
→ 200 Todo                           # 서버가 completedAt 세팅/해제
```

```
PATCH /todo-categories/{id}
body: { name: string }
→ 200 TodoCategory
```

### 1.5 삭제 (3단계)

```
PATCH  /todos/{id}/trash      → 200 Todo    # deletedAt = now (휴지통 이동)
PATCH  /todos/{id}/restore    → 200 Todo    # deletedAt = null (복원)
DELETE /todos/{id}            → 204         # 영구 삭제
DELETE /todos/trash           → 204         # 휴지통 비우기 (deletedAt NOT NULL 일괄 삭제)
```

```
DELETE /todo-categories/{id}  → 204
# 서버 캐스케이드: 해당 카테고리 소속 todo 들의 categoryId = null (기본함 이동) — 현재 클라 동작과 동일
```

### 1.6 향후 (스키마만 대비)

- 수동 재정렬: `order` 필드는 이미 존재. 리스트 내 드래그 정렬 도입 시
  `PATCH /todos/reorder body: { orderedIds: string[] }` 형태 예정 — v1 범위 아님.
- 카테고리 재정렬도 동일 패턴.

---

## 2. 메모 API

### 2.1 타입

```ts
interface Memo {
  id: string;
  title: string;
  content: JSONContent;   // Tiptap document JSON — 서버는 opaque JSON(JSONB/TEXT)으로 저장, 파싱/검증 불필요
  createdAt: string;
  updatedAt: string;
}
```

- `content` 빈 값 기준: `{ type: 'doc', content: [{ type: 'paragraph' }] }`
- 본문에 이미지 URL 포함 가능 — 이미지 업로드는 **기존 blog API 재사용 중**(`POST {BLOG_API}/file/upload/image`)이므로 메모 API 범위 아님.

### 2.2 조회

```
GET /memos              # updatedAt DESC (리스트 패널 정렬 기준)
GET /memos/{id}
```

- `content` 는 커질 수 있으므로 목록 응답에서는 `content` 제외를 권장:
  - 목록: `{ id, title, createdAt, updatedAt }[]`
  - 상세: full Memo
  - (목록에 본문 미리보기가 필요해지면 서버가 `excerpt: string` 파생 필드 제공)
- 검색/페이지네이션: 현재 UI 에 없음 — v1 미포함, `?q=`(title 검색) / cursor 기반은 v2 후보.

### 2.3 생성

```
POST /memos
body: 없음 (또는 {})
→ 201 Memo     # title:'', content:EMPTY_MEMO_CONTENT 로 서버 생성
```
- 현재 UX: "새 메모" 클릭 즉시 빈 메모 생성 후 편집 시작 → 빈 생성 허용 필수.

### 2.4 수정

```
PATCH /memos/{id}
body: Partial<{ title: string; content: JSONContent }>
→ 200 Memo (또는 { updatedAt } 만)
```
- 에디터 자동 저장이 붙으므로 호출 빈도 높음. 클라이언트 debounce 전제 + 서버는 last-write-wins.
- content 크기 상한 정의 필요 (예: 1MB — 이미지가 URL 참조라 본문 자체는 작음).

### 2.5 삭제

```
DELETE /memos/{id}  → 204   # 휴지통 없음, 즉시 영구 삭제 (현재 동작 동일)
```

---

## 3. 아티클 큐레이션 API

### 3.1 타입

```ts
interface ArticleCategory {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

interface ArticleSeo {
  title?: string;
  description?: string;
  imageUrl?: string;
}

interface Article {
  id: string;
  categoryId: string;      // required — 아티클은 반드시 카테고리 소속 (기본함 없음)
  title: string;
  url: string;
  seo?: ArticleSeo;        // 수집 실패 시 없음. 별도 테이블보다 JSON 컬럼 권장
  createdAt: string;
  updatedAt: string;
}

interface WeeklyCuration {
  weekKey: string;         // ISO 주차 키, 예: '2026-W34'
  articleIds: string[];    // 최대 WEEKLY_CURATION_LIMIT(5)개
}
```

### 3.2 조회 / 필터

```
GET /article-categories               # order ASC
GET /articles?categoryId={id}         # 생략 시 전체. createdAt DESC 권장(현재는 등록순 배열)
GET /article-curations                # 전체 주차 (주차 수 적음 — 전체 반환)
GET /article-curations/{weekKey}      # 단일 주차 (옵션)
```

- 사이드바 구성: `all`(전체) / `curation`(주간 큐레이션 뷰) / `category:{id}` — 필터는 categoryId 하나로 충분.
- 큐레이션 뷰는 `curationList` + 해당 `articleIds` 의 아티클 조인이 필요 → 응답에 아티클 임베드 옵션(`?expand=articles`) 고려.

### 3.3 생성

```
POST /article-categories
body: { name: string }
→ 201 ArticleCategory
```

```
POST /articles
body: {
  categoryId: string;      // required, 본인 카테고리 검증
  title: string;           // required
  url: string;             // required, URL 형식 검증
  seo?: ArticleSeo;
}
→ 201 Article
```
- **SEO 파싱은 클라이언트 플로우 유지**: URL 입력 → woolta 앱의 `/api/article-meta` 프록시로 og 태그 파싱 → 자동 채운 값과 함께 POST. (서버 파싱으로 옮기는 것은 선택 — 옮기면 `POST /articles/parse-seo` 추가)
- 중복 처리: 클라이언트에 `normalizeArticleUrl` 존재 — 서버도 **정규화된 URL 기준 유저 내 중복 시 409** 반환 권장.

### 3.4 수정

```
PATCH /article-categories/{id}   body: { name }              → 200
PATCH /articles/{id}             body: Partial<{ title; url; categoryId; seo }> → 200
```
- 현재 사용처는 `setArticleSeo`(seo 재수집 백필) 뿐이지만 범용 PATCH 로 정의.

### 3.5 삭제 (캐스케이드 주의)

```
DELETE /articles/{id} → 204
# 캐스케이드: 모든 주차 큐레이션에서 해당 articleId 제거, 빈 주차 큐레이션 row 삭제

DELETE /article-categories/{id} → 204
# 캐스케이드: 소속 아티클 전체 삭제 + 그 아티클들의 큐레이션 참조 제거 (현재 클라 동작 동일 — 이동 아님, 삭제임)
```

### 3.6 큐레이션 토글

```
PUT    /article-curations/{weekKey}/articles/{articleId}  → 200 WeeklyCuration   # 추가
DELETE /article-curations/{weekKey}/articles/{articleId}  → 200 WeeklyCuration   # 제거 (빈 주차면 row 삭제)
```
- 서버 제약: 주차당 **최대 5개**(`WEEKLY_CURATION_LIMIT`) — 초과 시 `409` (현재 클라는 조용히 무시하지만 서버는 명시 에러로).
- `weekKey` 형식 검증: `YYYY-W{1..53}` (클라 `getWeekKey` 와 동일 규칙 — ISO 8601 주차).
- 멱등: 이미 있는 articleId PUT → 200 그대로 반환 (현재 토글 UX 는 클라이언트에서 존재 여부 보고 PUT/DELETE 선택).

---

## 4. 클라이언트 전환 작업 (참고)

API 스펙은 위와 같고, 프론트 전환 시 공통으로 필요한 작업:

1. zustand persist 스토어 → **TanStack Query** (queries + mutations) 전환. 가계부 lib 의
   `getApiClient` + `browserApiUrl` 패턴 재사용 (`NEXT_PUBLIC_*_API_BROWSER` → rewrites 프록시).
2. 낙관적 업데이트 필요 지점: 체크 토글, 휴지통 이동/복원, 큐레이션 토글, 자동 저장(제목/메모/에디터).
3. UI 상태(selectedId, viewMode, isDetailVisible)는 로컬 스토어로 분리 유지.
4. 로컬스토리지 기존 데이터 1회 이관 (0장 마이그레이션 참고) 후 `woolta:*` 키 정리.
5. 401 처리: 대시보드는 비로그인 SSR 허용 구조(ScreenBoundary) — 각 앱 진입 시 로그인 안내로 폴백.
