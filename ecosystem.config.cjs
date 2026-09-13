/**
 * pm2 프로세스 정의 — woolta 모노레포의 Next 앱 3개.
 *
 * 한 파일에 모은 이유는 포트가 서로 부딪히면 안 되기 때문이다. 여기가 유일한 포트 표다.
 *
 *   blog      8091  →  blog.woolta.com
 *   woolbank  4200  →  bank.woolta.com
 *   woolta    4300  →  woolta.com (대시보드)
 *
 * 환경변수(NEXT_PUBLIC_*)는 **빌드 시점에 인라인**되므로 여기서 넣어도 늦다.
 * 각 앱의 `.env.production` 이 정본이고, pm2 는 런타임 PORT 만 준다.
 *
 * 특정 앱만 다루려면 `--only` 를 쓴다:
 *   pm2 reload ecosystem.config.cjs --only woolta-blog
 */
const path = require('node:path');

/** Next 앱 하나의 pm2 정의. 세 앱이 같은 모양이라 중복을 만들지 않는다. */
const nextApp = ({ name, dir, port }) => ({
  name,
  // `next start` 를 직접 가리킨다. pnpm 을 거치면 pm2 가 래퍼를 관리하게 돼 reload 가 지저분해진다.
  script: path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'),
  args: 'start',
  cwd: path.join(__dirname, 'apps', dir),
  instances: 1,
  exec_mode: 'fork',
  watch: false,
  env: {
    NODE_ENV: 'production',
    PORT: port,
  },
  min_uptime: 10_000,
  max_restarts: 5,
  restart_delay: 2_000,
  kill_timeout: 10_000,
  time: true,
});

module.exports = {
  apps: [
    nextApp({ name: 'woolta-blog', dir: 'blog', port: 8091 }),
    nextApp({ name: 'woolta-bank', dir: 'woolbank', port: 4200 }),
    nextApp({ name: 'woolta-dashboard', dir: 'woolta', port: 4300 }),
  ],
};
