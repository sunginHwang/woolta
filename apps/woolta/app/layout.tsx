import { cookies } from 'next/headers';
import { Providers } from '../components/layout/providers/Providers';
import { THEME_COOKIE_NAME, parseThemeType } from '../components/layout/store/themeCookie';

export const metadata = {
  title: 'Woolta',
  description: 'Woolta 서비스들을 한눈에 관리하는 대시보드',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialThemeType = parseThemeType((await cookies()).get(THEME_COOKIE_NAME)?.value);

  return (
    <html lang='ko'>
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover'
        />
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
