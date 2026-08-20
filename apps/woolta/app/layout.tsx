import { Providers } from '../components/layout/providers/Providers';

export const metadata = {
  title: 'Woolta',
  description: 'Woolta 서비스들을 한눈에 관리하는 대시보드',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <Providers>{children}</Providers>
        <div id='modalDeem' />
      </body>
    </html>
  );
}
