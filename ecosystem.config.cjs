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
 * node 실행 파일을 **절대경로로 고정**한다.
 *
 * `interpreter: 'node'` 로 두면 pm2 가 스폰 시점 PATH 로 해석한다.
 * 이 서버의 시스템 node 는 v10 이고 쓰는 node 는 nvm 아래 있어서, nvm 이 로드되지 않은
 * 비로그인 셸에서 reload 하면 standalone server.js 가 `??` 에서 SyntaxError 로 죽는다
 * (운영에서 실제로 터졌다 — bank 가 크래시 루프에 빠졌다).
 *
 * pm2 는 이 값을 dump.pm2 에 저장하므로 한 번 절대경로로 띄워두면 이후 reload 가
 * 어느 셸에서 실행되든 같은 node 를 쓴다. 그래서 `pm2 reload` 만으로는 안 고쳐지고
 * `pm2 delete` 후 이 파일로 다시 start 해야 반영된다.
 */
const interpreter = process.env.WOOLTA_NODE || process.execPath;

const nodeMajor = Number(process.versions.node.split('.')[0]);

// 잘못된 node 로 띄워 크래시 루프에 빠지느니 여기서 멈춘다.
if (nodeMajor < 20) {
  throw new Error(
    `node ${process.version} 로는 Next 16 standalone 이 뜨지 않는다. node 20 이상에서 pm2 를 실행할 것 ` +
      '(nvm 을 로드했는지 확인). 다른 node 를 쓰려면 WOOLTA_NODE 로 지정한다.',
  );
}

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
  interpreter,
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
