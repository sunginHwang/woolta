/**
 * pm2 프로세스 정의 — 서버에 올린 standalone 산출물을 실행한다.
 *
 * 이 파일은 **서버의 배포 디렉터리**에 둔다(레포가 아니다).
 * 빌드는 로컬에서 하고 tar 만 옮기므로, 서버에는 소스도 node_modules 도 없다.
 *
 *   /home/woolta/
 *     ├─ ecosystem.config.cjs   ← 이 파일
 *     ├─ blog/     (blog.tar.gz 를 푼 것)
 *     ├─ bank/
 *     └─ woolta/
 *
 * 포트가 서로 부딪히면 안 되므로 여기가 포트 표의 단일 소스다.
 *   blog 8091 · bank 4200 · 대시보드 4300
 */
const path = require('node:path');

/**
 * standalone 산출물 하나의 pm2 정의.
 *
 * server.js 는 모노레포 구조가 보존돼 `<루트>/apps/<앱>/server.js` 에 있다.
 * cwd 를 그 디렉터리로 잡아야 .next/static 과 public 을 찾는다.
 */
const standaloneApp = ({ name, dir, appDir, port }) => ({
  name,
  script: 'server.js',
  cwd: path.join(__dirname, dir, 'apps', appDir),
  interpreter: 'node',
  instances: 1,
  exec_mode: 'fork',
  watch: false,
  env: {
    NODE_ENV: 'production',
    PORT: port,
    // 0.0.0.0 으로 열지 않는다 — nginx 가 127.0.0.1 로만 프록시한다
    HOSTNAME: '127.0.0.1',
  },
  min_uptime: 10_000,
  max_restarts: 5,
  restart_delay: 2_000,
  kill_timeout: 10_000,
  time: true,
});

module.exports = {
  apps: [
    standaloneApp({ name: 'woolta-blog', dir: 'blog', appDir: 'blog', port: 8091 }),
    standaloneApp({ name: 'woolta-bank', dir: 'bank', appDir: 'woolbank', port: 4200 }),
    standaloneApp({ name: 'woolta-dashboard', dir: 'woolta', appDir: 'woolta', port: 4300 }),
  ],
};
