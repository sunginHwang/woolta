#!/usr/bin/env bash
#
# package.sh 가 만든 tar 를 서버로 올리고 pm2 를 재시작한다.
#
#   DEPLOY_HOST=user@woolta.com ./scripts/upload.sh             # 세 앱 모두
#   DEPLOY_HOST=user@woolta.com ./scripts/upload.sh blog        # blog 만
#
# 서버 디렉터리(기본 /home/woolta) 구조:
#   ecosystem.config.cjs   ← 레포의 것을 한 번 올려둔다
#   blog/ bank/ woolta/    ← 이 스크립트가 tar 를 풀어 넣는다
#
# 무중단을 위해 새 산출물을 옆에 푼 뒤 한 번에 바꾼다(디렉터리 교체 → pm2 reload).

set -euo pipefail

cd "$(dirname "$0")/.."

HOST="${DEPLOY_HOST:-}"
REMOTE_DIR="${DEPLOY_DIR:-/home/woolta}"
OUT_DIR="dist/deploy"

if [[ -z "$HOST" ]]; then
  echo "DEPLOY_HOST 가 없다. 예: DEPLOY_HOST=user@woolta.com ./scripts/upload.sh" >&2
  exit 1
fi

meta() {
  case "$1" in
    blog)          echo "blog woolta-blog 8091" ;;
    bank)          echo "woolbank woolta-bank 4200" ;;
    woolta|dash)   echo "woolta woolta-dashboard 4300" ;;
    *)             return 1 ;;
  esac
}

if [[ $# -eq 0 ]]; then
  set -- blog bank woolta
fi
TARGETS=("$@")

for t in "${TARGETS[@]}"; do
  if ! meta "$t" > /dev/null; then
    echo "알 수 없는 대상: $t (blog | bank | woolta)" >&2
    exit 1
  fi
  if [[ ! -f "${OUT_DIR}/${t}.tar.gz" ]]; then
    echo "${OUT_DIR}/${t}.tar.gz 이 없다. 먼저 ./scripts/package.sh $t 를 실행할 것." >&2
    exit 1
  fi
done

echo "==> 대상: ${TARGETS[*]}  →  ${HOST}:${REMOTE_DIR}"

for t in "${TARGETS[@]}"; do
  read -r _ proc port <<< "$(meta "$t")"
  echo "==> ${t} 업로드"

  ssh "$HOST" "mkdir -p '${REMOTE_DIR}'"
  scp -q "${OUT_DIR}/${t}.tar.gz" "${HOST}:${REMOTE_DIR}/${t}.tar.gz"

  echo "==> ${t} 교체 + 재시작"
  # 새 디렉터리에 먼저 풀고, 성공했을 때만 기존 것과 바꾼다.
  # 중간에 실패해도 돌고 있는 버전은 그대로 남는다.
  ssh "$HOST" bash -s <<REMOTE
set -euo pipefail

# nvm 으로 깔린 node/pm2 는 **비로그인 셸 PATH 에 없다**(ssh 로 넘기는 이 스크립트가 그렇다).
# 게다가 pm2 는 interpreter 를 스폰 시점 PATH 로 해석하므로, 여기서 PATH 를 맞추지 않으면
# 시스템 node(v10)로 떠서 standalone server.js 가 \`??\` 에서 SyntaxError 로 죽는다.
export NVM_DIR="\${NVM_DIR:-\$HOME/.nvm}"
[ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh" > /dev/null

command -v pm2 > /dev/null || { echo "    pm2 를 찾을 수 없다. 서버에 nvm/pm2 가 있는지 확인할 것." >&2; exit 1; }

node_major=\$(node -p 'process.versions.node.split(".")[0]')
if [ "\$node_major" -lt 20 ]; then
  echo "    node \$(node -v) 로는 Next 16 standalone 이 뜨지 않는다 (20 이상 필요)." >&2
  exit 1
fi

cd '${REMOTE_DIR}'

rm -rf '${t}.new'
mkdir -p '${t}.new'
tar -xzf '${t}.tar.gz' -C '${t}.new'
rm -f '${t}.tar.gz'

rm -rf '${t}.old'
[ -d '${t}' ] && mv '${t}' '${t}.old'
mv '${t}.new' '${t}'

# 프로세스 이름만 주고 reload 하면 pm2 가 dump.pm2 에 저장된 옛 설정(포트·interpreter 등)을
# 그대로 재사용한다 — ecosystem.config.cjs 를 고쳐도 운영에 영영 반영되지 않는다.
# 설정 파일을 지정해 매 배포마다 현재 설정으로 수렴시킨다.
if pm2 describe '${proc}' > /dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --only '${proc}' --update-env
else
  pm2 start ecosystem.config.cjs --only '${proc}'
fi
pm2 save

# 헬스체크 — 응답이 오면 이전 버전을 지운다
ok=""
for _ in \$(seq 1 15); do
  code=\$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${port}/" || true)
  case "\$code" in
    200|302|307) ok="\$code"; break ;;
  esac
  sleep 2
done

if [ -z "\$ok" ]; then
  echo "    ${t} (:${port}) 응답 없음. pm2 logs ${proc} 확인할 것." >&2
  echo "    이전 버전은 ${REMOTE_DIR}/${t}.old 에 남아 있다." >&2
  exit 1
fi

echo "    ${t} (:${port}) OK — \$ok"
rm -rf '${t}.old'
REMOTE
done

echo "==> 배포 완료"
