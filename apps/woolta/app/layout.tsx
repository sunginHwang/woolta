// StyleX 캐리어 CSS — 빌드 시 추출된 실제 CSS로 치환된다
import '@wds/colors/darkTheme.css';
import './stylex.css';
import './global.css';
import type { Viewport } from 'next';
import { cookies } from 'next/headers';
import { Providers } from '../components/layout/providers/Providers';
import { parseThemeType, THEME_COOKIE_NAME } from '../components/layout/store/themeCookie';

export const metadata = {
  title: 'Woolta',
  description: 'Woolta 서비스들을 한눈에 관리하는 대시보드',
};

// iOS에서 폰트 16px 미만 input 포커스 시 자동 확대되는 것을 막는다
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialThemeType = parseThemeType((await cookies()).get(THEME_COOKIE_NAME)?.value);

  return (
    <html lang='ko' data-theme={initialThemeType} data-scroll-behavior='smooth'>
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='stylesheet'
          as='style'
          crossOrigin=''
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css'
        />
      </head>
      <body>
        <Providers initialThemeType={initialThemeType}>{children}</Providers>
        <div id='modalDeem' />
      </body>
    </html>
  );
}
