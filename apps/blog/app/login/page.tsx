import { redirect } from 'next/navigation';

/**
 * blog 는 자체 로그인 화면을 두지 않는다.
 *
 * 인증은 `.woolta.com` 공유 쿠키 기반이라 어느 앱에서 로그인해도 blog 세션이 함께 성립한다.
 * 아이디/비번 로그인은 소셜 로그인으로 통합됐으므로, 이 라우트는 공용 로그인 화면으로 위임한다.
 */
const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? 'https://bank.woolta.com/user/login';

const LoginPage = () => {
  redirect(LOGIN_URL);
};

export default LoginPage;
