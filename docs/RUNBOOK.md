# 실행·배포 런북 (2026-11 기준, 실제 운영 절차)

`docs/DEPLOY.md` 는 설계 당시 문서다. **이 문서가 지금 돌아가는 방식**이다.
서버는 `woolta.com` 한 대(호스트명 `gommpo111`), 모든 프로세스는 root 의 pm2 로 돈다.

| 프로세스 | 포트 | 서버 디렉터리 | 코드 출처 | pm2 이름 |
|---|---|---|---|---|
| bank(가계부) | 4200 | `/home/frontend/bank` | 로컬 빌드 산출물 복사 | `woolta-bank` |
| 대시보드 | 4300 | `/home/frontend/woolta` | 로컬 빌드 산출물 복사 | `woolta-dashboard` |
| blog | 8091 | `/home/frontend/blog` | 로컬 빌드 산출물 복사 | `woolta-blog` |
| woolta-api | 4500 | `/home/woolta-api` (git checkout) | 서버에서 `deploy.sh` | `woolta-api` |
| aiho(카톡 봇) | 4999 | `/home/aiho` (git checkout) | 서버에서 pull·build | `aiho` |

FE 세 앱은 **서버에 소스도 node_modules 도 없다.** `/home/frontend/ecosystem.config.cjs` 가 standalone `server.js` 를 띄운다.

---

## 1. 로컬 실행

```bash
pnpm install

# 가계부 — HTTPS 필요(쿠키 도메인). 4200 을 bank-local.woolta.com:443 으로 프록시
pnpm turbo run dev --filter=woolbank
# (별도 터미널) local-ssl-proxy --source 443 --target 4200 --cert cert/... --key cert/...

# 대시보드 — 4300. API 연동 시 local.woolta.com:4433
pnpm turbo run dev --filter=woolta
pnpm dev:woolta-ssl

# API (woolta-api 레포)
cd ../woolta-api && source ~/.woolta-api.env && npm run dev      # :4500

# aiho (aiho 레포)
cd ../aiho && pnpm dev                                            # :4999
```

로컬 API 를 보게 하는 값은 각 앱 `.env.local` 에 있다(`NEXT_PUBLIC_GRAPHQL_API=http://localhost:4500`).
**이 파일은 운영 빌드에도 섞여 들어가므로 아래 배포 절차에서 반드시 치운다.**

검증 한 번에:

```bash
pnpm typecheck && pnpm lint && npx vitest run     # 유닛 + 스토리북(크로미움)
```

---

## 2. 배포 순서

API → DB(DDL 있을 때) → FE → aiho 순서다. FE 는 API 의 새 스키마를 전제로 빌드된다.

### 2-1. woolta-api (서버에서)

```bash
# 로컬
cd woolta-api && git push origin main

# 서버
ssh root@woolta.com
cd /home/woolta-api && ./scripts/deploy.sh
```

`deploy.sh` = git reset --hard origin/main → npm install → prisma generate → tsc → pm2 reload → 헬스체크.
env 는 `/etc/woolta/api.env` 하나다(pm2 설정이 직접 읽는다). 키를 추가하면 reload 로 반영된다.

기동 로그 확인:

```bash
pm2 logs woolta-api --nostream --lines 30
#  woolBank regular expenditure cron enabled
#  woolBank regular expenditure push cron enabled (09:00)
#  (없어야 함) woolBank push DISABLED ...
```

### 2-2. DDL 적용 (테이블 추가가 있을 때)

woolBank DB 는 레거시와 공유하므로 `prisma db push` 금지. SQL 파일을 스크립트로 적용한다.

```bash
# 서버, deploy.sh 로 코드를 받은 뒤
cd /home/woolta-api
set -a; . /etc/woolta/api.env; set +a
node scripts/applyWoolbankPushDdl.mjs scripts/<파일>.sql --dry-run   # 대상 DB·생성 예정 확인
node scripts/applyWoolbankPushDdl.mjs scripts/<파일>.sql
```

> **스키마 이름은 `woolBank`(대문자 B)** 다. Linux MySQL 은 대소문자를 구분해 `woolbank` 에 만들면 API 가 못 본다.
> 접속 정보는 반드시 `api.env` 의 `WOOLBANK_DATABASE_URL` 을 쓴다(위 명령이 그렇게 한다).

### 2-3. FE (로컬에서 빌드해 올린다)

```bash
cd woolta

# 1) .env.local 치우기 — 있으면 package.sh 가 중단한다(localhost 가 번들에 박히는 걸 막는다)
mv apps/woolbank/.env.local /tmp/woolbank.env.local
mv apps/woolta/.env.local   /tmp/woolta.env.local

# 2) 패키징: 타입체크 → 빌드 → dist/deploy/<app>.tar.gz (static·public·run.sh 포함)
./scripts/package.sh bank woolta        # blog 도 필요하면 추가

# 3) 업로드·교체·reload·헬스체크 (서버 경로는 /home/frontend)
DEPLOY_HOST=root@woolta.com DEPLOY_DIR=/home/frontend ./scripts/upload.sh bank woolta

# 4) .env.local 복구
mv /tmp/woolbank.env.local apps/woolbank/.env.local
mv /tmp/woolta.env.local   apps/woolta/.env.local
```

`upload.sh` 는 `<app>.new` 에 풀고 성공했을 때만 디렉터리를 바꾼 뒤 `pm2 reload ecosystem.config.cjs --only <proc>` 한다.
헬스체크(200/302/307) 를 통과하면 `<app>.old` 를 지우고, 실패하면 남겨 둔다 → 롤백은 `.old` 를 되돌리고 reload.

빌드 타임 값 확인(배포 후):

```bash
curl -sI https://bank.woolta.com/service-worker.js | grep -i cache-control   # no-store
curl -s -o /dev/null -w '%{http_code}\n' https://bank.woolta.com/notifications  # 307 → 로그인
```

`NEXT_PUBLIC_*` 는 번들에 인라인된다. 값을 바꾸면 재빌드·재배포다. 특히:

| 앱 | 파일 | 바꾸면 재빌드 |
|---|---|---|
| bank | `apps/woolbank/.env.production` | `NEXT_PUBLIC_GRAPHQL_API`, `NEXT_PUBLIC_WOOLBANK_VAPID_PUBLIC_KEY` |
| 대시보드 | `apps/woolta/.env` | `NEXT_PUBLIC_GRAPHQL_API`, 소셜 로그인 키 |

### 2-4. aiho (서버에서)

```bash
# 로컬
cd aiho && git push origin main

# 서버
ssh root@woolta.com
cd /home/aiho
export NVM_DIR=$HOME/.nvm && . $NVM_DIR/nvm.sh && nvm use 20
git pull && pnpm install --frozen-lockfile && pnpm run build
pm2 startOrReload deploy/ecosystem.config.cjs --update-env && pm2 save
pm2 logs aiho --nostream --lines 20 | grep -E 'aiho started|job 무장|error'
```

> `--update-env` 는 **현재 셸의 PATH 를 프로세스에 박는다.** 비로그인 셸에는 `/root/.local/bin`(claude CLI) 이 없어
> `claude: not found` 가 난 적이 있다. 그래서 `/home/aiho/.env` 의 `AIHO_CLAUDE_BIN` 을 절대경로
> `/root/.local/bin/claude` 로 고정해 두었다. 바꾸지 말 것.

레포의 `deploy/deploy-pm2-remote.sh` 는 기본값이 `bmo@…/home/bmo/code/aiho` 라 **이 서버와 다르다.**
쓰려면 `REMOTE_HOST=root@woolta.com REMOTE_DIR=/home/aiho` 를 준다.

---

## 3. 푸시 알림 운영 메모

| 항목 | 위치 |
|---|---|
| VAPID 키 쌍 | 서버 `/etc/woolta/api.env` 의 `WOOLBANK_VAPID_PUBLIC_KEY / PRIVATE_KEY / SUBJECT`. 로컬 사본은 `~/.woolta-api.env` |
| FE 공개키 | `apps/woolbank/.env.production` → 빌드에 인라인 |
| 구독 테이블 | `woolBank.user_push_subscription` (기기당 1행, userId 기준. 공유코드 세션도 원 계정 userId 로 저장) |
| 알림함 | `woolBank.user_notification`, 앱 `/notifications`, `/notifications/[id]` |
| 발송 경로 | aiho(08:00·21:00·월 08:00) → `createWoolBankNotification`(봇 인증) → 알림함 저장 + 전 기기 푸시 / woolta-api 자체 cron 09:00 정기지출 D-1 |
| 서비스워커 | `apps/woolbank/public/service-worker.js`, 캐시 금지 헤더는 `next.config.js` `headers()` |

**테스트 푸시 보내기 (봇 경로, 서버에서)**:

```bash
set -a; . /etc/woolta/api.env; set +a
curl -s -X POST http://127.0.0.1:4500/woolBank/graphql \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $WOOLTA_BOT_TOKEN" -H 'x-woolta-user-id: 13' \
  -d '{"query":"mutation($input: CreateWoolBankNotificationInput!){ createWoolBankNotification(input:$input){ id } }",
       "variables":{"input":{"kind":"TEST","title":"테스트","summary":"요약","content":"본문"}}}'
```

앱에서는 마이페이지 → 알림 설정 → "테스트 알림 보내기"(현재 기기만).

키 회전: `npx web-push generate-vapid-keys` → `api.env` 3개 교체 → API reload → FE 공개키 교체 후 재빌드·재배포.
기존 구독은 키가 달라 403 이 나므로 사용자가 토글을 껐다 켜야 한다(앱이 키 불일치를 감지해 재구독한다).

---

## 4. 롤백

| 대상 | 방법 |
|---|---|
| FE | `upload.sh` 실패 시 `/home/frontend/<app>.old` 가 남는다 → `mv <app>.old <app>` 후 `pm2 reload ecosystem.config.cjs --only <proc>`. 수동 배포 때는 `/home/frontend/<app>-backup-<ts>.tgz` |
| API | `cd /home/woolta-api && git reset --hard <직전 커밋> && ./scripts/deploy.sh` (DDL 은 되돌리지 않아도 하위호환) |
| aiho | 같은 방식으로 `git reset --hard` 후 build·reload |
| env | `/etc/woolta/api.env.bak-*`, `/home/aiho/.env.bak-*` 백업이 있다 |

---

## 5. 자주 걸리는 것

| 증상 | 원인·조치 |
|---|---|
| FE 가 localhost API 를 호출 | `.env.local` 을 둔 채 빌드. 치우고 다시 package |
| `The table ... does not exist` | DDL 을 소문자 `woolbank` 에 넣었거나 적용 안 함. 2-2 절차로 `woolBank` 에 적용 |
| 알림 설정 카드가 안 보임 | FE 공개키가 비어 빌드됨(의도된 숨김). `.env.production` 채우고 재빌드 |
| 푸시 `DISABLED` 로그 | `api.env` 에 VAPID 키 없음 |
| aiho `claude: not found` | PATH 문제. `AIHO_CLAUDE_BIN` 절대경로 확인 |
| 09:00 정기지출 알림 안 옴 | `ENABLE_WOOLBANK_CRON=1` 확인(레거시 Koa cron 과 동시에 켜면 이중 등록) |
| 시드/수동 INSERT 시각이 9시간 틀어짐 | mariadb 드라이버가 서버 로컬(KST)로 쓴다. Prisma 는 UTC 로 쓰므로 수동 삽입은 UTC 문자열로 넣을 것 |
