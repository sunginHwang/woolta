#!/usr/bin/env bash
#
# 로컬에서 빌드해 서버로 옮길 산출물을 만든다.
#
#   ./scripts/package.sh                # 세 앱 모두
#   ./scripts/package.sh blog           # blog 만
#   ./scripts/package.sh bank woolta    # 여러 개
#
# 결과: dist/deploy/<app>.tar.gz  — 각 tar 는 그 자체로 실행 가능하다(node server.js).
#
# 왜 standalone 인가: 서버에 소스도 node_modules 도 두지 않는다.
# Next 가 실제로 쓰는 파일만 추적해 묶어주므로 pnpm 심볼릭 링크 문제도 없다.
#
# 주의: static 과 public 은 standalone 에 자동으로 들어가지 않는다(Next 공식 문서).
# 여기서 직접 복사한다 — 빠뜨리면 CSS·이미지가 전부 404 다.

set -euo pipefail

cd "$(dirname "$0")/.."
OUT_DIR="dist/deploy"

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
done

# NEXT_PUBLIC_* 는 빌드 시점에 번들로 박힌다.
# .env.local 은 운영 빌드에서도 .env.production 을 덮으므로, 있으면 로컬 주소가 박힌 채로 서버에 올라간다.
echo "==> .env.local 확인"
for t in "${TARGETS[@]}"; do
  read -r dir _ _ <<< "$(meta "$t")"
  if [[ -f "apps/${dir}/.env.local" ]]; then
    echo "    apps/${dir}/.env.local 이 있다." >&2
    echo "    운영 빌드에서 .env.production 을 덮어 localhost 가 박힌다. 옮기거나 지운 뒤 다시 실행할 것." >&2
    exit 1
  fi
done

echo "==> 필수 환경변수 확인"
for t in "${TARGETS[@]}"; do
  read -r dir _ _ <<< "$(meta "$t")"
  found=""
  for env_file in "apps/${dir}/.env.production" "apps/${dir}/.env"; do
    if [[ -f "$env_file" ]] && grep -qE '^NEXT_PUBLIC_GRAPHQL_API=.+' "$env_file"; then
      found="$env_file"
      break
    fi
  done
  if [[ -z "$found" ]]; then
    echo "    apps/${dir} 에 NEXT_PUBLIC_GRAPHQL_API 가 없다." >&2
    exit 1
  fi
  echo "    ${dir}: $(grep -hE '^NEXT_PUBLIC_GRAPHQL_API=' "$found" | head -1)"
done

echo "==> 타입체크"
for t in "${TARGETS[@]}"; do
  read -r dir _ _ <<< "$(meta "$t")"
  pnpm turbo run typecheck --filter="$dir"
done

echo "==> 빌드"
for t in "${TARGETS[@]}"; do
  read -r dir _ _ <<< "$(meta "$t")"
  NODE_ENV=production pnpm turbo run build --filter="$dir" --force
done

mkdir -p "$OUT_DIR"

echo "==> 패키징"
for t in "${TARGETS[@]}"; do
  read -r dir proc port <<< "$(meta "$t")"
  app_root="apps/${dir}"
  stage="${OUT_DIR}/${t}"

  if [[ ! -d "${app_root}/.next/standalone" ]]; then
    echo "    ${app_root}/.next/standalone 이 없다. next.config.js 의 output: 'standalone' 을 확인할 것." >&2
    exit 1
  fi

  rm -rf "$stage"
  cp -R "${app_root}/.next/standalone" "$stage"

  # standalone 이 자동으로 넣지 않는 것들
  cp -R "${app_root}/.next/static" "${stage}/${app_root}/.next/static"
  if [[ -d "${app_root}/public" ]]; then
    cp -R "${app_root}/public" "${stage}/${app_root}/public"
  fi

  # 서버에서 그대로 실행할 수 있게 진입 스크립트를 같이 넣는다
  cat > "${stage}/run.sh" <<RUN
#!/usr/bin/env bash
# ${proc} 실행 진입점. pm2 가 이 파일을 부른다.
set -euo pipefail
cd "\$(dirname "\$0")/${app_root}"
exec node server.js
RUN
  chmod +x "${stage}/run.sh"

  tar -czf "${OUT_DIR}/${t}.tar.gz" -C "$stage" .
  rm -rf "$stage"

  size=$(du -h "${OUT_DIR}/${t}.tar.gz" | cut -f1)
  echo "    ${t} → ${OUT_DIR}/${t}.tar.gz  (${size}, :${port} ${proc})"
done

echo "==> 완료. 서버 배포는 docs/DEPLOY.md 참고."
