import { Suspense } from 'react';
import { LoginCard } from '../../components/login/LoginCard';

export const metadata = {
  title: '로그인 · Woolta',
};

/** 게이트가 붙이는 `?next=` 를 읽으려면 useSearchParams 가 Suspense 경계 안에 있어야 한다. */
const LoginPage = () => (
  <Suspense>
    <LoginCard />
  </Suspense>
);

export default LoginPage;
