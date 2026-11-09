// StyleX 캐리어 CSS — 빌드 시 추출된 실제 CSS로 치환된다
import '@wds/colors/darkTheme.css';
import './stylex.css';
import './global.css';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { RootProvider } from '../domains/layout/root-provider/RootProvider';
import { parseThemeType, THEME_COLOR, THEME_COOKIE_NAME } from '../store/themeCookie';
import { setConfig } from '../utils/config';

export const metadata: Metadata = {
  title: '뱅킷리스트',
  description: '계좌 정보를 한곳에 모으고 도전하고 싶은 버킷리스트를 만들어봐요~',
  keywords: '자산, 버킷리스트, 토이프로젝트',
  authors: {
    name: 'sungin hwang',
    url: 'https://blog.woolta.com/',
  },
  applicationName: 'BanketList',
};

// iOS에서 폰트 16px 미만 input 포커스 시 자동 확대되는 것을 막는다
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

setConfig();

export default async function RootLayout({ children }: { children: ReactNode }) {
  // 쿠키의 테마를 첫 렌더에 반영해야 라이트 → 다크 깜빡임이 없다 (apps/woolta 와 같은 방식)
  const initialThemeType = parseThemeType((await cookies()).get(THEME_COOKIE_NAME)?.value);
  const isDark = initialThemeType === 'dark';

  return (
    <html lang='ko' data-theme={initialThemeType} data-scroll-behavior='smooth'>
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/static/woolta.ico' type='icon' />
        <link rel='apple-touch-icon-precomposed' href='/static/woolta.ico' />
        <link rel='icon' type='icon' href='/static/woolta.ico' sizes='196x196' />
        <link rel='icon' type='icon' href='/static/woolta.ico' sizes='96x96' />
        <link rel='icon' type='icon' href='/static/woolta.ico' sizes='32x32' />
        <link rel='icon' type='icon' href='/static/woolta.ico' sizes='16x16' />
        <link rel='icon' type='icon' href='/static/woolta.ico' sizes='128x128' />
        <link rel='apple-touch-icon' href='/static/woolta.ico' />
        <link rel='shortcut icon' href='/static/woolta.ico' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content={THEME_COLOR[initialThemeType]} />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content={isDark ? 'black' : 'white'} />
        <meta name='google-site-verification' content='mHu43Zp59l_qzcOGtYILaM-tIH-mPKepPuYxRwbIqbs' />
        <link
          rel='stylesheet'
          as='style'
          crossOrigin=''
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css'
        />
      </head>
      <body suppressHydrationWarning>
        <RootProvider initialThemeType={initialThemeType}>{children}</RootProvider>
        <div id='modalDeem' />
      </body>
    </html>
  );
}
