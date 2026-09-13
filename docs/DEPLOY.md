# 배포 가이드

woolta 서비스 네 개를 단일 서버(`woolta.com`)에 pm2 로 올린다.

> **확인 필요한 가정**
> 이 문서는 nginx · MariaDB · 레거시 백엔드가 모두 `woolta.com` 한 대에 있다고 본다.
> 서버가 여러 대라면 **이미지 업로드 디렉터리 공유**(아래 참고)를 먼저 해결해야 한다.

---

## 1. 전체 구조

```
                          woolta.com (nginx :443)
                                   │
   ┌───────────────┬───────────────┼───────────────┬──────────────────┐
   │               │               │               │                  │
blog.woolta.com  bank.woolta.com  woolta.com   api.woolta.com   image.woolta.com
   │ :8091         │ :4200         │ :4300        │ :4100            │
   ▼               ▼               ▼              ▼                  ▼
woolta-blog     woolta-bank   woolta-dashboard  woolta-api    /home/blog/post/upload
                                                                  (정적, 백엔드 미개입)
```

| 프로세스 | 포트 | 레포 | pm2 이름 |
|---|---|---|---|
| blog | 8091 | `woolta/apps/blog` | `woolta-blog` |
| bank | 4200 | `woolta/apps/woolbank` | `woolta-bank` |
| 대시보드 | 4300 | `woolta/apps/woolta` | `woolta-dashboard` |
| API | **4100** | `woolta-api` | `woolta-api` |

**API 가 4100 인 이유** — 레거시 Koa `woolbankApi` 가 4000 을 쓰고 있다. Koa 를 내린 뒤에도 4100 을 유지한다. 바꾸면 nginx 와 FE 의 `NEXT_PUBLIC_GRAPHQL_API` 를 함께 고쳐야 한다.

### 이미지는 쓰기와 읽기가 갈린다

```
업로드  브라우저 → woolta-api → /home/blog/post/upload/ 에 파일 기록
조회    브라우저 → nginx(image.woolta.com) → 같은 디렉터리에서 직접 전송
```

woolta-api 는 **읽기에 관여하지 않는다.** 그래서 API 를 재시작해도 이미지 조회는 무중단이고, 반대로 **API 가 그 디렉터리에 쓰지 못하면 업로드가 전부 실패한다.** `IMAGE_UPLOAD_PATH` 와 nginx `root` 가 같은 경로여야 한다.

---

## 2. 서버 최초 준비 (1회)

```bash
# Node — API 가 24 이상을 요구한다
nvm install 24 && nvm alias default 24
npm i -g pm2 pnpm@10.34.5

# nginx 공통 스니펫
sudo cp woolta/deploy/nginx/_upstream-common.conf /etc/nginx/snippets/woolta-next.conf

# vhost
sudo cp woolta/deploy/nginx/{blog,bank,woolta}*.conf  /etc/nginx/sites-available/
sudo cp woolta-api/deploy/nginx/*.conf                /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/<파일> /etc/nginx/sites-enabled/   # 파일마다

# 인증서 — vhost 의 ssl_certificate 주석을 풀기 전에 발급한다
sudo certbot --nginx -d api.woolta.com -d woolta.com

sudo nginx -t && sudo systemctl reload nginx

# API 환경변수
sudo mkdir -p /etc/woolta
sudo cp woolta-api/deploy/api.env.example /etc/woolta/api.env
sudo chmod 600 /etc/woolta/api.env     # DB 비밀번호가 들어간다
sudo chown $USER /etc/woolta/api.env
$EDITOR /etc/woolta/api.env            # 값 채우기

# 부팅 시 pm2 자동 기동
pm2 startup && pm2 save
```

---

## 3. 배포 순서 — 이 순서를 지켜야 한다

FE 세 앱이 모두 woolta-api 를 바라보도록 이관됐다. **API 가 먼저 떠 있어야 FE 가 동작한다.**

### 3-1. woolta-api 먼저

```bash
cd /home/woolta-api
./scripts/deploy.sh
```

스크립트가 하는 일: `git pull` → `npm ci` → prisma 생성 → 타입체크 → `pm2 reload` → 헬스체크.
타입체크를 통과해야 reload 한다. 깨진 코드를 올리면 롤백이 더 비싸다.

확인:

```bash
curl -sf -X POST https://api.woolta.com/blog/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ categoryList { totalCount } }"}'
```

### 3-2. FE env 를 채운다 — **빌드 전에**

`NEXT_PUBLIC_*` 는 **빌드 시점에 번들로 박힌다.** 배포 후에는 고칠 수 없고 재빌드해야 한다.

세 앱의 `.env.production` 에서 주석을 풀고 값을 넣는다:

```bash
NEXT_PUBLIC_GRAPHQL_API=https://api.woolta.com
```

비워 두면 레거시 호스트로 폴백해 `/blog/graphql` 이 **404** 가 난다. 배포 스크립트가 이 값을 검사하고 비어 있으면 중단한다.

### 3-3. FE 배포

```bash
cd /home/woolta
./scripts/deploy.sh              # 세 앱 모두
./scripts/deploy.sh blog         # 하나만
./scripts/deploy.sh bank dash    # 여러 개
```

빌드를 **끝낸 뒤** reload 한다. Next 는 빌드 중 `.next` 를 갈아엎으므로 프로세스를 먼저 내리면 그동안 서비스가 죽는다.

---

## 4. 레거시 백엔드 종료

FE 는 이미 레거시를 호출하지 않는다(실측: blog 0건, bank 0건). 그러나 **바로 내리면 안 된다.**

### 먼저: 이미지 URL 이전

기존 업로드 이미지가 **DB 에 레거시 호스트 절대경로로 박혀 있다.**

| 대상 | 현재 값 |
|---|---|
| 가계부 카테고리 아이콘 | `bank-api.woolta.com/uploads/...` |
| 버킷 썸네일 | `banketlist-api.woolta.com/uploads/...` (인증서 만료) |

코드가 다 이관돼도 백엔드를 내리면 **이 이미지들이 전부 깨진다.** 파일을 `image.woolta.com` 이 읽는 디렉터리로 옮기고 DB 값을 치환해야 한다. 이 작업은 아직 하지 않았다.

### 그다음: 종료 절차

```bash
# 1) Koa woolbankApi 정지
pm2 stop woolbankApiServer

# 2) 정기지출 크론을 woolta-api 로 넘긴다
#    app.ts 의 cron 블록과 상단 import 주석을 풀고 (커밋 65984ae 의 역)
#    /etc/woolta/api.env 에 ENABLE_WOOLBANK_CRON=1 추가
#    ※ 둘 다 켜져 있으면 정기지출이 이중 등록된다

# 3) 레거시 refresh 토큰 거부
#    /etc/woolta/api.env 에 AUTH_REFRESH_STORE_STRICT=1 추가

cd /home/woolta-api && ./scripts/deploy.sh

# 4) Spring blog jar 정지 — 이미지 조회는 nginx 가 하므로 영향 없다
sudo systemctl stop techblog-api   # 또는 kill <PID>
```

종료 후 정리:
- `graphqlFetch.ts` 의 `NEXT_PUBLIC_BLOG_API` 폴백 제거
- 각 앱 `.env*` 에서 `NEXT_PUBLIC_BLOG_API` / `NEXT_PUBLIC_BANK_API` 제거
- `apps/blog/utils/config.ts` 의 `blogApiUrl`, `apps/woolbank/utils/config.ts` 의 `apiUrl` — 이미 소비처 0인 죽은 값
- 포트 4000 회수

---

## 5. 운영

```bash
pm2 list                      # 상태
pm2 logs woolta-api --lines 100
pm2 reload woolta-blog        # 코드 변경 없이 재시작
pm2 monit                     # 실시간
```

### 롤백

```bash
cd /home/woolta
git log --oneline -10
git reset --hard <직전 커밋>
./scripts/deploy.sh
```

API 도 같은 방식이다. **DB 마이그레이션이 섞인 배포는 코드 롤백만으로 돌아가지 않는다** — `post_file` 의 `app_type` 처럼 컬럼 추가는 하위호환이라 안전하지만, 컬럼 삭제·타입 변경이 있었다면 DDL 을 먼저 되돌려야 한다.

### 자주 나는 문제

| 증상 | 원인 |
|---|---|
| FE 에서 GraphQL 404 | `NEXT_PUBLIC_GRAPHQL_API` 미설정 → 레거시 호스트로 폴백. **재빌드 필요** |
| 업로드는 되는데 이미지가 404 | `IMAGE_UPLOAD_PATH` 와 nginx `root` 경로 불일치 |
| 업로드 413 | nginx `client_max_body_size` (vhost 에 20m 로 설정돼 있다) |
| 로그인이 자꾸 풀림 | `AUTH_SECRET_TOKEN_KEY` 가 레거시와 다름, 또는 `AUTH_COOKIE_DOMAIN` 이 `.woolta.com` 이 아님 |
| API 가 4000 에서 안 뜸 | 레거시 Koa 가 점유 중. 4100 을 쓴다 |
| 정기지출이 두 번 등록됨 | Koa 와 woolta-api 크론이 동시에 켜짐 |

---

## 6. 파일 위치

| 파일 | 역할 |
|---|---|
| `woolta/ecosystem.config.cjs` | Next 앱 3개 pm2 정의 — **포트 표의 단일 소스** |
| `woolta/scripts/deploy.sh` | 모노레포 배포 (`blog` `bank` `dash` 선택 가능) |
| `woolta/deploy/nginx/*.conf` | FE vhost |
| `woolta-api/ecosystem.config.cjs` | API pm2 정의 |
| `woolta-api/scripts/deploy.sh` | API 배포 |
| `woolta-api/deploy/nginx/*.conf` | API · 이미지 vhost |
| `woolta-api/deploy/api.env.example` | `/etc/woolta/api.env` 템플릿 |
