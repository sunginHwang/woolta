'use client';

import { BlogScreensProvider } from '@blog/screens';
import dynamic from 'next/dynamic';

const BlogWriteScreen = dynamic(() => import('@blog/screens').then((mod) => mod.BlogWriteScreen), { ssr: false });

export default function BlogWritePage() {
  return (
    <BlogScreensProvider basePath='/blog'>
      <BlogWriteScreen />
    </BlogScreensProvider>
  );
}
