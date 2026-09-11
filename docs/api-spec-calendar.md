# 캘린더 API 스펙

woolta 대시보드 4번째 앱. 엔드포인트는 `/calendar/graphql` (woolta-api).

- 백엔드: `woolta-api/src/apps/calendar/`
- 테이블 DDL: `woolta-api/scripts/dashboardDdl.sql` (dashboard DB)
- Prisma: `woolta-api/prisma/schemaCalendar.prisma`
- 프론트 도메인 lib: `libs/calendar/{features,screens}`

## 시간 규약

- `startAt` / `endAt` 은 **UTC** 로 오가고, 표시 시간대 변환은 클라이언트가 한다.
- `endAt` 은 **exclusive** 다. 종일 일정 8/1 하루는 `endAt = 8/2 00:00`.
  FullCalendar 의 종일 `end` 규약과 같아서 변환 없이 그대로 주고받는다.
- 범위 조회의 겹침 판정은 `startAt < range.endAt AND endAt > range.startAt` 이다.
  `startAt` 만 보면 기간을 가로지르는 장기 일정이 빠진다.

## 공유 모델

**양방향 · 읽기 전용**이다.

- `calendar_share` 의 수락된 1행이 **두 사람 모두**의 열람 권한을 뜻한다.
  그래서 조회 시 `requester_id` / `addressee_id` 양쪽 컬럼을 모두 본다.
- 쓰기는 언제나 소유자만. 공유받은 일정은 `isMine: false` 로 내려가고 서버도 수정을 거부한다.
- 초대 식별자는 **가입 이메일**이다.
- 역방향 초대가 대기 중이면(상대가 먼저 나를 초대) 새 행을 만들지 않고 그 초대를 수락한다
  (`ACCEPTED_MUTUAL`). 두 행이 남으면 어느 쪽이 권한의 근거인지 모호해진다.
- 거절 이력이 있는 쌍을 다시 초대하면 같은 행을 `PENDING` 으로 되돌린다
  (유니크 키가 쌍 단위라 재생성이 불가능하다).

### 권한

| 동작 | 권한자 |
|---|---|
| 초대 (`requestCalendarShare`) | 누구나 (자기 자신 제외) |
| 수락/거절 (`respondCalendarShare`) | `addressee` 만 |
| 대기 중 초대 취소 (`cancelCalendarShare`) | `requester` 만 |
| 수락된 공유 해제 (`cancelCalendarShare`) | 양쪽 누구나 |

## 알림

별도 알림 테이블이 없다. **"내가 받은 `PENDING` 초대"가 곧 알림**이다
(`pendingCalendarShareList`). 로그인 후 첫 화면에서 배지로 노출하고 거기서 바로 수락/거절한다.

웹푸시(`subscribeWebPush` / `sendPushToAll`)와는 연결하지 않았다 — 요구가 "로그인 시 알림"이라
인앱 조회로 충분하고, 푸시를 붙이려면 초대 시점에 발송 트리거를 따로 넣어야 한다.

## Query

| 필드 | 설명 | 인증 |
|---|---|---|
| `calendarEventList(input: CalendarEventRangeInput!)` | 기간과 겹치는 일정 — 내 것 + 공유 수락된 상대 것 | `requireAuth` (읽기라 공유코드 로그인 허용) |
| `calendarShareList` | 수락된 관계 + 내가 보낸 대기 초대 | `requireRealUser` |
| `pendingCalendarShareList` | 내가 받은 대기 초대 (알림) | `requireRealUser` |

조회 기간은 최대 400일로 제한한다 (월 뷰가 최대 6주라 충분하고, 실수로 전체를 긁는 걸 막는다).

## Mutation

| 필드 | 비고 |
|---|---|
| `createCalendarEvent` | 제목 필수(255자), 설명 5000자, `endAt > startAt` |
| `updateCalendarEvent` | 소유자만. 부분 갱신이라 기존 값과 병합 후 범위를 검증한다 |
| `deleteCalendarEvent` | 소유자만. 휴지통 없이 즉시 삭제 |
| `requestCalendarShare` | 실패도 **에러가 아니라 결과 코드**로 돌려준다 (아래) |
| `respondCalendarShare` | `addressee` 만. 이미 처리된 요청은 `BAD_REQUEST` |
| `cancelCalendarShare` | 위 권한 표 참고 |

### `RequestCalendarShareResultCode`

`REQUESTED` / `ACCEPTED_MUTUAL` / `ALREADY_SHARED` / `ALREADY_PENDING` / `USER_NOT_FOUND` / `SELF`

'이미 공유 중' 같은 건 예외 상황이 아니고 화면이 상황별 안내를 띄워야 해서 코드로 준다.
문구는 클라이언트가 정한다 (`useCalendarShareMutations.REQUEST_SHARE_MESSAGE`).

**알려진 트레이드오프**: `USER_NOT_FOUND` 는 해당 이메일의 가입 여부를 알려준다.
이메일 초대를 선택한 대가이며, 열거 공격을 막아야 하면 결과를 `REQUESTED` 로 뭉개거나
초대 호출에 레이트리밋을 걸어야 한다 (현재 없음).

## 크로스 DB

캘린더 테이블은 dashboard DB, `user` 테이블은 woolbank DB라 **조인이 불가능**하다.
`CalendarShareService` 가 user 도메인의 Prisma 클라이언트로 **조회만** 위임한다.
일정 목록은 소유자가 섞여 있어 `getCalendarUserMap` 으로 한 번에 받아 N+1 을 피한다.
