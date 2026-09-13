#!/usr/bin/env bash
#
# woolta 모노레포 배포 — 서버에서 실행한다.
#
#   ./scripts/deploy.sh              # 세 앱 모두
#   ./scripts/deploy.sh blog         # blog 만
#   ./scripts/deploy.sh bank dash    # 여러 개
#
# 하는 일: git pull → 설치 → 타입체크 → 빌드 → pm2 reload → 헬스체크
#
# 빌드를 먼저 끝내고 reload 한다. Next 는 빌드 중 .next 를 갈아엎으므로
# 돌고 있는 프로세스를 먼저 내리면 그동안 서비스가 죽는다.

set -euo pipefail

cd "$(dirname "$0")/.."
BRANCH="${DEPLOY_BRANCH:-main}"

# 이름(인자) → turbo 필터 · pm2 프로세스 · 포트
# 연관배열(bash 4+)을 쓰지 않는다 — macOS 의 bash 3.2 에서도 돌아야 검증이 가능하다.
meta() {
  case "$1" in
    blog) echo "blog woolta-blog 8091" ;;
    bank) echo "woolbank woolta-bank 4200" ;;
    dash) echo "woolta woolta-dashboard 4300" ;;
    *)    return 1 ;;
  esac
}

if [[ $# -eq 0 ]]; then
  set -- blog bank dash
fi
TARGETS=("$@")

for t in "${TARGETS[@]}"; do
  if ! meta "$t" > /dev/null; then
    echo "알 수 없는 대상: $t (blog | bank | dash)" >&2
    exit 1
  fi
done

echo "==> 대상: ${TARGETS[*]}"

echo "==> 코드 갱신 ($BRANCH)"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> 의존성 설치"
pnpm install --frozen-lockfile

# NEXT_PUBLIC_* 는 빌드 시점에 번들로 박힌다. 비어 있으면 런타임에 고칠 방법이 없다.
echo "==> 필수 환경변수 확인"
for t in "${TARGETS[@]}"; do
  read -r filter _ _ <<< "$(meta "$t")"
  env_file="apps/${filter}/.env.production"
  if ! grep -qE '^NEXT_PUBLIC_GRAPHQL_API=.+' "$env_file"; then
    echo "    $env_file 의 NEXT_PUBLIC_GRAPHQL_API 가 비어 있다." >&2
    echo "    이 값은 빌드에 인라인되므로 배포 후에는 고칠 수 없다." >&2
    exit 1
  fi
done

echo "==> 타입체크"
for t in "${TARGETS[@]}"; do
  read -r filter _ _ <<< "$(meta "$t")"
  pnpm turbo run typecheck --filter="$filter"
done

echo "==> 빌드"
for t in "${TARGETS[@]}"; do
  read -r filter _ _ <<< "$(meta "$t")"
  pnpm turbo run build --filter="$filter"
done

echo "==> pm2 반영"
for t in "${TARGETS[@]}"; do
  read -r _ proc _ <<< "$(meta "$t")"
  if pm2 describe "$proc" > /dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --only "$proc" --update-env
  else
    pm2 start ecosystem.config.cjs --only "$proc"
  fi
done
pm2 save

echo "==> 헬스체크"
sleep 3
for t in "${TARGETS[@]}"; do
  read -r _ proc port <<< "$(meta "$t")"
  ok=""
  for _ in $(seq 1 15); do
    # 인증 게이트가 걸린 앱은 로그인으로 302 를 준다 — 응답이 오면 살아있는 것이다
    code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${port}/" || true)
    if [[ "$code" =~ ^(200|302|307)$ ]]; then
      ok="$code"
      break
    fi
    sleep 2
  done
  if [[ -z "$ok" ]]; then
    echo "    $t (:$port) 응답 없음. pm2 logs $proc 확인할 것." >&2
    exit 1
  fi
  echo "    $t (:$port) OK — $ok"
done

echo "==> 배포 완료"
